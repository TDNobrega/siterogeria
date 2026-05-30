// ============================================================
// SISTEMA ROGÉRIA — Legal Ops
// Google Apps Script — Código.gs
// Captura e tratamento de documentos para escritório de advocacia
// Canal 1: Email (documentos@rogeriaoliveira.com)
// Canal 2: WhatsApp via LiderHub API (múltiplos workspaces)
// ============================================================

// ---- CONSTANTES GERAIS ----
var PASTA_NOME        = 'ARQUIVOS CLIENTES / EMAIL E LIDERHUB';
var QUERY_EMAIL       = 'to:documentos@rogeriaoliveira.com has:attachment is:unread';
var GEMINI_MODEL      = 'gemini-2.5-flash';
var LIDERHUB_BASE_URL = 'https://api.liderhub.com.br';

// ---- TIPOS DE DOCUMENTO RECONHECIDOS ----
var TIPOS_DOCUMENTO = [
  { tipo: 'CNH',                    palavras: ['cnh', 'habilitacao', 'habilitação', 'carteira de motorista', 'driver'] },
  { tipo: 'RG',                     palavras: ['rg', 'identidade', 'registro geral'] },
  { tipo: 'CPF',                    palavras: ['cpf', 'cadastro de pessoa'] },
  { tipo: 'Comprovante de Residência', palavras: ['residencia', 'residência', 'comprovante', 'conta de luz', 'conta de agua', 'conta de água', 'conta de gas', 'conta de gás', 'boleto', 'fatura'] },
  { tipo: 'Imposto de Renda',       palavras: ['imposto de renda', 'irpf', 'declaracao', 'declaração', 'receita federal'] },
  { tipo: 'Certidão de Nascimento', palavras: ['nascimento', 'certidao de nascimento', 'certidão de nascimento'] },
  { tipo: 'Certidão de Casamento',  palavras: ['casamento', 'certidao de casamento', 'certidão de casamento'] },
  { tipo: 'Passaporte',             palavras: ['passaporte', 'passport'] },
  { tipo: 'Contrato Social',        palavras: ['contrato social', 'contrato_social'] },
  { tipo: 'Procuração',             palavras: ['procuracao', 'procuração'] },
  { tipo: 'Documento',              palavras: [] } // fallback
];

// ============================================================
// CONFIGURAÇÃO — lê variáveis do PropertiesService
// ============================================================
function cfg() {
  var props = PropertiesService.getScriptProperties();
  return {
    geminiKey:        props.getProperty('GEMINI_API_KEY'),
    sheetId:          props.getProperty('SHEET_ID'),
    vercelProcessUrl: props.getProperty('VERCEL_PROCESS_URL'),
    vercelProcessKey: props.getProperty('VERCEL_PROCESS_KEY'),
    alertEmail:       props.getProperty('ALERT_EMAIL') || 'documentos@rogeriaoliveira.com'
  };
}

// ============================================================
// LEADS - LANDING PAGE /professores
// Recebe dados do formulário e salva na aba "Leads Professores"
// ============================================================
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName('Leads Professores');

    if (!aba) {
      aba = planilha.insertSheet('Leads Professores');
      aba.appendRow(['Data/Hora', 'Nome', 'WhatsApp', 'E-mail', 'Situação', 'Mensagem', 'Arquivo']);
      aba.getRange(1, 1, 1, 7)
        .setFontWeight('bold')
        .setBackground('#C5973A')
        .setFontColor('#ffffff');
      aba.setFrozenRows(1);
      aba.setColumnWidth(1, 150);
      aba.setColumnWidth(2, 200);
      aba.setColumnWidth(3, 170);
      aba.setColumnWidth(4, 210);
      aba.setColumnWidth(5, 140);
      aba.setColumnWidth(6, 300);
      aba.setColumnWidth(7, 150);
    }

    var ultimaLinha = aba.getLastRow() + 1;
    var telFormatado = dados.telefone || '';
    var telNumeros   = telFormatado.replace(/\D/g, '');
    var waNum        = telNumeros.startsWith('55') ? telNumeros : '55' + telNumeros;

    aba.getRange(ultimaLinha, 1).setValue(new Date());
    aba.getRange(ultimaLinha, 2).setValue(dados.nome     || '');
    aba.getRange(ultimaLinha, 3).setFormula('=HYPERLINK("https://wa.me/' + waNum + '","' + telFormatado + '")');
    aba.getRange(ultimaLinha, 4).setValue(dados.email    || '');
    aba.getRange(ultimaLinha, 5).setValue(dados.situacao || '');
    aba.getRange(ultimaLinha, 6).setValue(dados.mensagem || '');
    aba.getRange(ultimaLinha, 7).setValue(dados.arquivo  || '');

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('ERRO doPost: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', msg: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// INSTALAR TRIGGER — executa verificarEmails a cada 15 minutos
// ============================================================
function instalarTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'verificarEmails') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('verificarEmails')
    .timeBased()
    .everyMinutes(15)
    .create();
  Logger.log('Trigger instalado: verificarEmails a cada 15 minutos.');
}

// ============================================================
// VERIFICAR EMAILS — ponto de entrada principal
// ============================================================
function verificarEmails() {
  _alertasBuffer = []; // reseta buffer de alertas
  Logger.log('=== verificarEmails iniciado ===');
  var threads = GmailApp.search(QUERY_EMAIL);
  Logger.log('Threads encontradas: ' + threads.length);

  for (var i = 0; i < threads.length; i++) {
    var mensagens = threads[i].getMessages();
    for (var j = 0; j < mensagens.length; j++) {
      var msg = mensagens[j];
      if (!msg.isUnread()) continue;
      try {
        processarEmailAnexos(msg);
        msg.markRead();
      } catch (e) {
        Logger.log('ERRO ao processar mensagem "' + msg.getSubject() + '": ' + e.message);
      }
    }
  }

  // Envia alerta agrupado se houver documentos novos
  enviarAlertaSumario(_alertasBuffer);
  _alertasBuffer = [];

  Logger.log('=== verificarEmails concluído ===');
}

// ============================================================
// PROCESSAR ANEXOS DE UM EMAIL
// ============================================================
function processarEmailAnexos(msg) {
  var assunto  = msg.getSubject() || '';
  var remetente = msg.getFrom()  || '';
  var anexos   = msg.getAttachments();

  Logger.log('Email de: ' + remetente + ' | Assunto: ' + assunto + ' | Anexos: ' + anexos.length);
  if (anexos.length === 0) return;

  var nomeCliente = extrairNomeCliente(assunto, remetente);

  for (var k = 0; k < anexos.length; k++) {
    try {
      tratarDocumento(anexos[k], nomeCliente, remetente);
    } catch (e) {
      Logger.log('ERRO no anexo "' + anexos[k].getName() + '": ' + e.message);
    }
  }
}

// ============================================================
// EXTRAIR NOME DO CLIENTE — do assunto ou remetente
// ============================================================
function extrairNomeCliente(assunto, remetente) {
  if (assunto && assunto.trim().length > 2) {
    var limpo = assunto.replace(/^(re:|fwd:|fw:|enc:|encaminhado:)\s*/gi, '').trim();
    if (limpo.length > 2) return limpo;
  }
  var match = remetente.match(/^([^<@]+)/);
  if (match) return match[1].trim().replace(/"/g, '');
  return 'Cliente Desconhecido';
}

// ============================================================
// TRATAR DOCUMENTO — decide fluxo imagem vs PDF vs outros
// ============================================================
function tratarDocumento(anexo, nomeCliente, remetente) {
  var nomeOriginal = anexo.getName();
  var mimeType     = anexo.getContentType();
  Logger.log('Tratando: ' + nomeOriginal + ' (' + mimeType + ')');

  // ── Salva original imediatamente (fail-safe) ─────────────────
  var ext           = nomeOriginal.split('.').pop() || 'bin';
  var nomeArqOrig   = 'orig_' + new Date().getTime() + '.' + ext;
  try {
    salvarOriginalNoDrive(anexo.copyBlob(), nomeCliente, nomeArqOrig);
  } catch (e) {
    Logger.log('Aviso: não salvou original: ' + e.message);
  }

  var nomeFinal, blob, tipo;

  if (mimeType === 'application/pdf') {
    tipo      = identificarTipoPorNome(nomeOriginal);
    nomeFinal = tipo + '.pdf';
    blob      = anexo.copyBlob().setName(nomeFinal);

  } else if (mimeType.indexOf('image/') === 0) {
    var bytes   = anexo.copyBlob().getBytes();
    var base64  = Utilities.base64Encode(bytes);
    var analise = analisarComGemini(base64, mimeType);
    tipo        = analise.tipo   || 'Documento';
    var angulo  = analise.rotacao || 0;

    try {
      var blobLimpo = processarImagemViaVercel(anexo.copyBlob(), mimeType, angulo);
      blob      = converterParaPdf(blobLimpo, tipo);
      nomeFinal = tipo + '.pdf';
    } catch (e) {
      Logger.log('Aviso: processamento Vercel falhou, convertendo original: ' + e.message);
      blob      = converterParaPdf(anexo.copyBlob(), tipo);
      nomeFinal = tipo + '_original.pdf';
    }

  } else {
    tipo      = 'Documento';
    nomeFinal = 'Documento_' + nomeOriginal;
    blob      = anexo.copyBlob().setName(nomeFinal);
  }

  var arquivo = salvarNoDrive(blob, nomeCliente);
  registrarNaPlanilha(nomeCliente, nomeFinal, tipo, arquivo.getUrl(), remetente, 'Email', 'Email');
  Logger.log('Editado salvo: ' + arquivo.getName() + ' — ' + arquivo.getUrl());
}

// ============================================================
// CONVERTER PARA PDF — via documento Google temporário
// ============================================================
function converterParaPdf(blobImagem, nomeBase) {
  Logger.log('Convertendo para PDF: ' + nomeBase);

  var docTemp = DocumentApp.create('_rogeria_tmp_' + new Date().getTime());
  var body    = docTemp.getBody();

  // Margens mínimas para melhor aproveitamento da página
  body.setMarginTop(18);
  body.setMarginBottom(18);
  body.setMarginLeft(18);
  body.setMarginRight(18);

  body.appendImage(blobImagem);
  docTemp.saveAndClose();

  var docId   = docTemp.getId();
  var pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  pdfBlob.setName(nomeBase + '.pdf');

  try { DriveApp.getFileById(docId).setTrashed(true); } catch (e) {
    Logger.log('Aviso: não foi possível deletar doc temporário: ' + e.message);
  }

  Logger.log('PDF criado: ' + nomeBase + '.pdf');
  return pdfBlob;
}

// ============================================================
// ANALISAR COM GEMINI — 1ª chamada: tipo + ângulo de rotação
// ============================================================
function analisarComGemini(base64Image, mimeType) {
  var c = cfg();
  if (!c.geminiKey) throw new Error('GEMINI_API_KEY não configurada.');

  var prompt =
    'Você é um especialista em documentos jurídicos brasileiros. ' +
    'Analise esta imagem e responda APENAS em JSON válido, sem markdown, sem explicações. ' +
    'Formato exato: {"tipo":"TIPO_DO_DOCUMENTO","rotacao":ANGULO_NUMERICO,"confianca":VALOR} ' +
    'Exemplo de resposta: {"tipo":"Imposto de Renda","rotacao":270,"confianca":0.95} ' +
    '"tipo" é o nome do documento: CNH, RG, CPF, Comprovante de Residência, Passaporte, ' +
    'Certidão de Nascimento, Certidão de Casamento, Imposto de Renda, Contrato Social, Procuração ou Documento. ' +
    '"rotacao" é quantos graus NO SENTIDO HORÁRIO são necessários para o texto ficar legível: 0, 90, 180 ou 270. ' +
    'Se o texto já estiver legível na orientação atual, use rotacao 0. ' +
    '"confianca" é um número de 0.0 a 1.0 indicando sua certeza.';

  var payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Image } }
      ]
    }],
    generationConfig: { temperature: 0.05 }
  };

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL +
    ':generateContent?key=' + c.geminiKey;

  try {
    var resposta = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var json = JSON.parse(resposta.getContentText());
    if (json.error) throw new Error(json.error.message);

    var texto = json.candidates[0].content.parts[0].text.trim()
      .replace(/```json/gi, '').replace(/```/g, '').trim();

    var resultado = JSON.parse(texto);
    Logger.log('Gemini 1ª chamada → tipo: ' + resultado.tipo +
               ' | rotação: ' + resultado.rotacao +
               ' | confiança: ' + resultado.confianca);
    return resultado;

  } catch (e) {
    Logger.log('ERRO Gemini 1ª chamada: ' + e.message + ' — usando fallback');
    return { tipo: 'Documento', rotacao: 0, confianca: 0 };
  }
}

// ============================================================
// ANALISAR BBOX COM GEMINI — 2ª chamada: bounding box na imagem rotacionada
// ============================================================
function analisarBboxComGemini(base64Image, mimeType, larguraImg, alturaImg) {
  var c = cfg();
  if (!c.geminiKey) throw new Error('GEMINI_API_KEY não configurada.');

  var prompt =
    'Você é um especialista em corte de documentos. ' +
    'Esta imagem já está na orientação CORRETA de leitura. ' +
    'A imagem tem ' + larguraImg + ' pixels de largura e ' + alturaImg + ' pixels de altura. ' +
    'Encontre o bounding box que cobre o documento físico (papel) na imagem. ' +
    'REGRAS OBRIGATÓRIAS: ' +
    '1. Inclua o documento COMPLETO — não corte nenhuma parte (rodapé, cabeçalho, laterais, cantos). ' +
    '2. Prefira incluir um pouco de fundo (mesa, toalha) a cortar qualquer parte do documento. ' +
    '3. Adicione 15 pixels de margem extra em todos os 4 lados além do documento. ' +
    'Responda APENAS em JSON válido, sem markdown, sem explicações. ' +
    'Formato exato: {"x":X,"y":Y,"largura":LARGURA,"altura":ALTURA} ' +
    'x e y = canto superior esquerdo do documento em pixels. ' +
    'largura e altura = dimensões que cobrem o documento INTEIRO com margem de 15px.';

  var payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Image } }
      ]
    }],
    generationConfig: { temperature: 0.05 }
  };

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL +
    ':generateContent?key=' + c.geminiKey;

  try {
    var resposta = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var json = JSON.parse(resposta.getContentText());
    if (json.error) throw new Error(json.error.message);

    var texto = json.candidates[0].content.parts[0].text.trim()
      .replace(/```json/gi, '').replace(/```/g, '').trim();

    var bbox = JSON.parse(texto);
    Logger.log('Gemini 2ª chamada → bbox: x=' + bbox.x + ' y=' + bbox.y +
               ' w=' + bbox.largura + ' h=' + bbox.altura);
    return bbox;

  } catch (e) {
    Logger.log('ERRO Gemini 2ª chamada: ' + e.message + ' — usando fallback (5% de margem)');
    var m = Math.round(larguraImg * 0.05);
    return { x: m, y: m, largura: larguraImg - m * 2, altura: alturaImg - m * 2 };
  }
}

// ============================================================
// TRATAR NO CLOUDINARY — fluxo completo de imagens (2 passes)
// ============================================================
function tratarNoCloudinary(anexo, nomeOriginal, mimeType) {

  // Converte para base64 para o Gemini
  var bytes  = anexo.copyBlob().getBytes();
  var base64 = Utilities.base64Encode(bytes);

  // ---- PASSO 1: Gemini detecta tipo + rotação ----
  var analise = analisarComGemini(base64, mimeType);
  var tipo    = analise.tipo || 'Documento';
  var angulo  = analise.rotacao || 0;
  if ([0, 90, 180, 270].indexOf(angulo) === -1) angulo = 0;

  // ---- PASSO 2: Upload original para o Cloudinary ----
  var publicIdOriginal = 'rogeria_orig_' + new Date().getTime();
  var urlOriginal      = uploadCloudinary(anexo.copyBlob(), publicIdOriginal, mimeType);

  // Aplica rotação via URL do Cloudinary (sem novo upload)
  var urlRotacionada = (angulo === 0)
    ? urlOriginal
    : urlOriginal.replace('/upload/', '/upload/a_' + angulo + '/');

  // Faz download da imagem já rotacionada
  var respostaRot     = UrlFetchApp.fetch(urlRotacionada, { muteHttpExceptions: true });
  var blobRotacionado = respostaRot.getBlob().setContentType(mimeType);
  var base64Rot       = Utilities.base64Encode(blobRotacionado.getBytes());

  // ---- PASSO 3: Upload da imagem rotacionada → obtém dimensões reais ----
  var publicIdRot  = 'rogeria_rot_' + new Date().getTime();
  var uploadResult = uploadCloudinaryCompleto(blobRotacionado, publicIdRot, mimeType);
  var urlRot       = uploadResult.url;
  var imgW         = uploadResult.width;
  var imgH         = uploadResult.height;

  Logger.log('Dimensões da imagem rotacionada: ' + imgW + 'x' + imgH);

  // ---- PASSO 4: Gemini detecta bbox na imagem rotacionada ----
  var bbox = analisarBboxComGemini(base64Rot, mimeType, imgW, imgH);

  // Aplica margem de segurança adicional (+20px em todos os lados) + clamp
  var MARGEM = 20;
  var bx = Math.max(0,       Math.round(bbox.x)       - MARGEM);
  var by = Math.max(0,       Math.round(bbox.y)       - MARGEM);
  var bw = Math.min(imgW - bx, Math.round(bbox.largura) + MARGEM * 2);
  var bh = Math.min(imgH - by, Math.round(bbox.altura)  + MARGEM * 2);

  Logger.log('Bbox final com margem: x=' + bx + ' y=' + by + ' w=' + bw + ' h=' + bh);

  // ---- PASSO 5: Aplica crop via Cloudinary ----
  var transf   = 'c_crop,x_' + bx + ',y_' + by + ',w_' + bw + ',h_' + bh;
  var urlFinal = urlRot.replace('/upload/', '/upload/' + transf + '/');

  Logger.log('Cloudinary URL final: ' + urlFinal);

  var respostaFinal = UrlFetchApp.fetch(urlFinal, { muteHttpExceptions: true });
  var blobFinal     = respostaFinal.getBlob().setContentType(mimeType);

  // ---- PASSO 6: Deleta uploads temporários do Cloudinary ----
  try { deletarCloudinary(publicIdOriginal); } catch (e) {
    Logger.log('Aviso: não deletou original no Cloudinary: ' + e.message);
  }
  try { deletarCloudinary(publicIdRot); } catch (e) {
    Logger.log('Aviso: não deletou rotacionado no Cloudinary: ' + e.message);
  }

  return { blob: blobFinal, tipo: tipo };
}

// ============================================================
// UPLOAD CLOUDINARY — envia blob e retorna URL
// ============================================================
function uploadCloudinary(blob, publicId, mimeType) {
  return uploadCloudinaryCompleto(blob, publicId, mimeType).url;
}

// ============================================================
// UPLOAD CLOUDINARY COMPLETO — retorna {url, width, height}
// ============================================================
function uploadCloudinaryCompleto(blob, publicId, mimeType) {
  var c = cfg();
  if (!c.cloudinaryCloud || !c.cloudinaryApiKey || !c.cloudinarySecret) {
    throw new Error('Credenciais do Cloudinary não configuradas.');
  }

  var timestamp  = Math.floor(Date.now() / 1000).toString();
  var parametros = 'public_id=' + publicId + '&timestamp=' + timestamp;
  var assinatura = assinarCloudinary(parametros, c.cloudinarySecret);

  var url = 'https://api.cloudinary.com/v1_1/' + c.cloudinaryCloud + '/image/upload';

  var resposta = UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      file:       blob,
      public_id:  publicId,
      timestamp:  timestamp,
      api_key:    c.cloudinaryApiKey,
      signature:  assinatura
    },
    muteHttpExceptions: true
  });

  var json = JSON.parse(resposta.getContentText());
  if (json.error) throw new Error('Cloudinary upload erro: ' + json.error.message);

  Logger.log('Cloudinary upload OK: ' + json.secure_url + ' (' + json.width + 'x' + json.height + ')');
  return { url: json.secure_url, width: json.width, height: json.height };
}

// ============================================================
// DELETAR CLOUDINARY — remove imagem pelo public_id
// ============================================================
function deletarCloudinary(publicId) {
  var c = cfg();

  var timestamp  = Math.floor(Date.now() / 1000).toString();
  var parametros = 'public_id=' + publicId + '&timestamp=' + timestamp;
  var assinatura = assinarCloudinary(parametros, c.cloudinarySecret);

  var resposta = UrlFetchApp.fetch(
    'https://api.cloudinary.com/v1_1/' + c.cloudinaryCloud + '/image/destroy',
    {
      method: 'post',
      payload: {
        public_id:  publicId,
        timestamp:  timestamp,
        api_key:    c.cloudinaryApiKey,
        signature:  assinatura
      },
      muteHttpExceptions: true
    }
  );

  var json = JSON.parse(resposta.getContentText());
  if (json.result === 'ok') {
    Logger.log('Cloudinary deletado: ' + publicId);
  } else {
    Logger.log('Cloudinary delete: ' + JSON.stringify(json));
  }
}

// ============================================================
// ASSINAR CLOUDINARY — gera assinatura SHA-1
// ============================================================
function assinarCloudinary(parametros, secret) {
  var mensagem = parametros + secret;
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, mensagem);
  return bytes.map(function(b) {
    var h = (b < 0 ? b + 256 : b).toString(16);
    return h.length === 1 ? '0' + h : h;
  }).join('');
}

// ============================================================
// SALVAR NO DRIVE — salva blob na subpasta do cliente
// ============================================================
function salvarNoDrive(blob, nomeCliente) {
  var pastaCli  = obterOuCriarPasta(nomeCliente);
  var pastaEdit = obterOuCriarSubpasta(pastaCli, 'Editado');
  var arquivo   = pastaEdit.createFile(blob);
  Logger.log('Editado salvo: ' + arquivo.getName() + ' | ' + pastaEdit.getName());
  return arquivo;
}

function salvarOriginalNoDrive(blob, nomeCliente, nomeArquivo) {
  blob.setName(nomeArquivo);
  var pastaCli  = obterOuCriarPasta(nomeCliente);
  var pastaOrig = obterOuCriarSubpasta(pastaCli, 'Original');
  var arquivo   = pastaOrig.createFile(blob);
  Logger.log('Original salvo: ' + arquivo.getName() + ' | ' + pastaOrig.getName());
  return arquivo;
}

// ============================================================
// OBTER PASTA RAIZ — retorna (ou cria) PASTA_NOME no Drive
// ============================================================
function obterPastaRaiz() {
  var iter = DriveApp.getFoldersByName(PASTA_NOME);
  if (iter.hasNext()) return iter.next();
  var pasta = DriveApp.createFolder(PASTA_NOME);
  Logger.log('Pasta raiz criada: ' + PASTA_NOME);
  return pasta;
}

// ============================================================
// OBTER OU CRIAR PASTA — hierarquia: PASTA_NOME / nomeCliente
// (canal Email — sem subpasta de workspace)
// ============================================================
function obterOuCriarPasta(nomeCliente) {
  return obterOuCriarSubpasta(obterPastaRaiz(), nomeCliente);
}

// ============================================================
// OBTER PASTA WORKSPACE — hierarquia: PASTA_NOME / [workspace.pasta]
// Usa o campo 'pasta' do JSON do workspace como nome da subpasta
// ============================================================
function obterPastaWorkspaceDrive(workspace) {
  // Prioridade 1: pastaId configurado explicitamente no JSON
  if (workspace.pastaId) {
    try {
      return DriveApp.getFolderById(workspace.pastaId);
    } catch (e) {
      Logger.log('Aviso: pastaId inválido para ' + workspace.nome + ', usando nome: ' + e.message);
    }
  }
  // Fallback: cria subpasta pelo nome dentro da pasta raiz
  var nomePasta = workspace.pasta || workspace.nome || 'Sem Workspace';
  return obterOuCriarSubpasta(obterPastaRaiz(), nomePasta);
}

// ============================================================
// REGISTRAR NA PLANILHA — aba 'Pendentes'
// ============================================================
function registrarNaPlanilha(nomeCliente, nomeArquivo, tipoDocumento, urlArquivo, remetente, workspace, canal, planilha, emailExtra) {
  var c         = cfg();
  if (!c.sheetId) throw new Error('SHEET_ID não configurado.');
  var pl        = planilha || SpreadsheetApp.openById(c.sheetId);
  var aba       = criarAbaPendentes(pl);
  var wsNome    = workspace || 'Email';
  var canalNome = canal     || 'Email';

  // Salva Date real — necessário para COUNTIFS por data funcionar
  aba.appendRow([new Date(), wsNome, canalNome, nomeCliente, tipoDocumento, nomeArquivo, urlArquivo, 'Pendente']);

  // Substitui URL bruta por link clicável "📄 Abrir"
  var lastRow  = aba.getLastRow();
  var richText = SpreadsheetApp.newRichTextValue()
    .setText('📄 Abrir')
    .setLinkUrl(urlArquivo)
    .build();
  aba.getRange(lastRow, 7).setRichTextValue(richText);

  // Acumula no buffer para envio de alerta agrupado ao final do ciclo
  _alertasBuffer.push({
    nomeCliente:   nomeCliente,
    tipoDocumento: tipoDocumento,
    workspace:     wsNome,
    canal:         canalNome,
    urlArquivo:    urlArquivo,
    emailExtra:    emailExtra || ''   // email adicional do workspace (ex: previdenciario@)
  });

  Logger.log('Registrado na planilha: ' + wsNome + ' | ' + nomeCliente + ' | ' + tipoDocumento);
}

// ============================================================
// CRIAR ABA PENDENTES — cria se não existir, garante cabeçalho
// ============================================================
function criarAbaPendentes(planilha) {
  var aba = planilha.getSheetByName('Pendentes');

  if (!aba) {
    aba = planilha.insertSheet('Pendentes');
  }

  // Garante cabeçalho atualizado (8 colunas)
  var cabecalho = aba.getRange(1, 1, 1, 8).getValues()[0];
  if (cabecalho[0] !== 'Data/Hora' || cabecalho[1] !== 'Workspace') {
    aba.clearContents();
    aba.appendRow(['Data/Hora', 'Workspace', 'Canal', 'Cliente', 'Tipo de Documento', 'Nome do Arquivo', 'Link no Drive', 'Status']);

    // Cabeçalho
    var header = aba.getRange(1, 1, 1, 8);
    header.setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff').setFontSize(10);
    aba.setFrozenRows(1);

    // Formata coluna A como data/hora real (permite COUNTIFS por data)
    aba.getRange('A2:A1000').setNumberFormat('dd/mm/yyyy HH:mm:ss');

    // Larguras de coluna
    aba.setColumnWidth(1, 140); // Data/Hora
    aba.setColumnWidth(2, 160); // Workspace
    aba.setColumnWidth(3, 90);  // Canal
    aba.setColumnWidth(4, 180); // Cliente
    aba.setColumnWidth(5, 150); // Tipo
    aba.setColumnWidth(6, 180); // Arquivo
    aba.setColumnWidth(7, 60);  // Link (botão)
    aba.setColumnWidth(8, 110); // Status

    // Formatação condicional — coluna Status (H)
    var regras = [];
    var cores = [
      { texto: 'Pendente',    fundo: '#fff3e0', fonte: '#e65100' },
      { texto: 'Em Análise', fundo: '#e3f2fd', fonte: '#0d47a1' },
      { texto: 'Concluído',  fundo: '#e8f5e9', fonte: '#1b5e20' }
    ];
    cores.forEach(function(c) {
      regras.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(c.texto)
        .setBackground(c.fundo)
        .setFontColor(c.fonte)
        .setBold(true)
        .setRanges([aba.getRange('H2:H1000')])
        .build());
    });
    aba.setConditionalFormatRules(regras);

    Logger.log('Aba "Pendentes" criada/atualizada (8 colunas).');
  }

  // Sempre aplica (idempotente) — dropdown + filtro
  _aplicarFormatacaoPendentes(aba);
  return aba;
}

// ============================================================
// FORMATAR PENDENTES — dropdown de status + filtro automático
// ============================================================
function _aplicarFormatacaoPendentes(aba) {
  // Dropdown de status na coluna H
  var regra = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pendente', 'Em Análise', 'Concluído'], true)
    .setAllowInvalid(false)
    .build();
  aba.getRange('H2:H1000').setDataValidation(regra);

  // Filtro automático no cabeçalho
  if (!aba.getFilter()) aba.getRange(1, 1, 1, 8).createFilter();

  // Coluna G mais estreita ("📄 Abrir" não precisa de muito espaço)
  aba.setColumnWidth(7, 75);
}

// ============================================================
// DEDUPLICAÇÃO — cache de IDs de mensagens já processadas
// Evita reprocessar documentos e salva doc enviado antes da tag
// ============================================================

// Cache em memória válido por execução — reseta entre triggers
var _processadosCache = null;

// Buffer de alertas — acumula documentos do ciclo e envia 1 email resumido
var _alertasBuffer = [];

function criarAbaProcessados(planilha) {
  var aba = planilha.getSheetByName('Processados');
  if (!aba) {
    aba = planilha.insertSheet('Processados');
    aba.appendRow(['Data/Hora', 'ID da Mensagem', 'Cliente', 'Workspace', 'Tipo de Documento']);
    aba.getRange(1, 1, 1, 5)
      .setFontWeight('bold')
      .setBackground('#6aa84f')
      .setFontColor('#ffffff');
    aba.setFrozenRows(1);
    aba.setColumnWidth(2, 300);
    aba.getRange('A2:A5000').setNumberFormat('dd/mm/yyyy HH:mm:ss');
    Logger.log('Aba "Processados" criada.');
  }
  return aba;
}

function getProcessadosCache(planilha) {
  if (_processadosCache !== null) return _processadosCache;
  var aba   = criarAbaProcessados(planilha);
  var dados = aba.getDataRange().getValues();
  _processadosCache = {};
  for (var i = 1; i < dados.length; i++) {
    var id = dados[i][1];
    if (id) _processadosCache[String(id)] = true;
  }
  Logger.log('[Processados] Cache carregado: ' + Object.keys(_processadosCache).length + ' IDs');
  return _processadosCache;
}

function isMensagemProcessada(planilha, msgId) {
  if (!msgId) return false;
  return getProcessadosCache(planilha)[String(msgId)] === true;
}

function marcarMensagemProcessada(planilha, msgId, nomeContato, nomeWorkspace, tipo) {
  if (!msgId) return;
  getProcessadosCache(planilha)[String(msgId)] = true;
  var aba = planilha.getSheetByName('Processados');
  aba.appendRow([new Date(), msgId, nomeContato, nomeWorkspace, tipo || 'Documento']);
}

// ============================================================
// DASHBOARD — visão executiva com contadores por workspace/status
// ============================================================
function criarDashboard(planilha) {
  var aba = planilha.getSheetByName('Dashboard');
  if (!aba) {
    aba = planilha.insertSheet('Dashboard', 0); // primeira aba
  } else {
    aba.clearContents();
    aba.clearFormats();
    aba.clearConditionalFormatRules();
  }

  // Lê workspaces configurados
  var workspaces = [];
  try {
    var wsJson = PropertiesService.getScriptProperties().getProperty('LIDERHUB_WORKSPACES');
    if (wsJson) workspaces = JSON.parse(wsJson).map(function(w) { return w.nome; });
  } catch(e) {}
  workspaces.push('Email');

  var ts  = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy 'às' HH:mm");
  var cor = '#1a237e';

  // ── Título ──────────────────────────────────────────────────
  aba.getRange('A1:G1').merge()
    .setValue('PAINEL DE DOCUMENTOS — ROGÉRIA OLIVEIRA ADVOCACIA')
    .setBackground(cor).setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');

  aba.getRange('A2:G2').merge()
    .setValue('Atualizado em: ' + ts)
    .setFontColor('#757575').setFontSize(9).setHorizontalAlignment('center');

  // ── Seção: Por Workspace ─────────────────────────────────────
  aba.getRange('A4:G4').merge()
    .setValue('DOCUMENTOS POR WORKSPACE')
    .setBackground('#e8eaf6').setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('left');

  var headerWs = ['Workspace', 'Pendente', 'Em Análise', 'Concluído', 'Total', '', ''];
  aba.getRange(5, 1, 1, 7).setValues([headerWs])
    .setFontWeight('bold').setBackground('#3949ab').setFontColor('#ffffff');

  var linha = 6;
  workspaces.forEach(function(ws) {
    aba.getRange(linha, 1).setValue(ws);
    aba.getRange(linha, 2).setFormula('=COUNTIFS(Pendentes!B:B,"' + ws + '",Pendentes!H:H,"Pendente")');
    aba.getRange(linha, 3).setFormula('=COUNTIFS(Pendentes!B:B,"' + ws + '",Pendentes!H:H,"Em Análise")');
    aba.getRange(linha, 4).setFormula('=COUNTIFS(Pendentes!B:B,"' + ws + '",Pendentes!H:H,"Concluído")');
    aba.getRange(linha, 5).setFormula('=SUM(B' + linha + ':D' + linha + ')');
    if (linha % 2 === 0) aba.getRange(linha, 1, 1, 5).setBackground('#f5f5f5');
    linha++;
  });

  // Linha de totais
  var totalLinha = linha;
  aba.getRange(totalLinha, 1).setValue('TOTAL');
  aba.getRange(totalLinha, 2).setFormula('=SUM(B6:B' + (totalLinha - 1) + ')');
  aba.getRange(totalLinha, 3).setFormula('=SUM(C6:C' + (totalLinha - 1) + ')');
  aba.getRange(totalLinha, 4).setFormula('=SUM(D6:D' + (totalLinha - 1) + ')');
  aba.getRange(totalLinha, 5).setFormula('=SUM(E6:E' + (totalLinha - 1) + ')');
  aba.getRange(totalLinha, 1, 1, 5).setFontWeight('bold').setBackground('#c5cae9');

  // ── Seção: Este Mês ──────────────────────────────────────────
  var mesLinha = totalLinha + 2;
  aba.getRange(mesLinha, 1, 1, 3).merge()
    .setValue('ESTE MÊS')
    .setBackground('#e8eaf6').setFontWeight('bold').setFontSize(10);

  // Sem "=" no prefixo — são expressões dentro de uma fórmula maior, não fórmulas independentes
  var mesInicio = 'DATE(YEAR(TODAY()),MONTH(TODAY()),1)';
  var mesFim    = 'DATE(YEAR(TODAY()),MONTH(TODAY())+1,1)';

  var estatisticas = [
    ['Documentos recebidos', '=COUNTIFS(Pendentes!A:A,">="&' + mesInicio + ',Pendentes!A:A,"<"&' + mesFim + ')'],
    ['Pendentes',            '=COUNTIFS(Pendentes!A:A,">="&' + mesInicio + ',Pendentes!A:A,"<"&' + mesFim + ',Pendentes!H:H,"Pendente")'],
    ['Em Análise',           '=COUNTIFS(Pendentes!A:A,">="&' + mesInicio + ',Pendentes!A:A,"<"&' + mesFim + ',Pendentes!H:H,"Em Análise")'],
    ['Concluídos',           '=COUNTIFS(Pendentes!A:A,">="&' + mesInicio + ',Pendentes!A:A,"<"&' + mesFim + ',Pendentes!H:H,"Concluído")']
  ];

  estatisticas.forEach(function(stat, i) {
    var r = mesLinha + 1 + i;
    aba.getRange(r, 1).setValue(stat[0]);
    aba.getRange(r, 2).setFormula(stat[1]).setFontWeight('bold').setFontSize(11);
    if (i % 2 === 0) aba.getRange(r, 1, 1, 2).setBackground('#f5f5f5');
  });

  // ── Seção: Últimos Documentos ────────────────────────────────
  var ultsLinha = mesLinha + estatisticas.length + 2;
  aba.getRange(ultsLinha, 1, 1, 7).merge()
    .setValue('ÚLTIMOS 5 DOCUMENTOS RECEBIDOS')
    .setBackground('#e8eaf6').setFontWeight('bold').setFontSize(10);

  // ORDER BY A DESC funciona corretamente porque A é Date real (não texto)
  aba.getRange(ultsLinha + 1, 1).setFormula(
    '=IFERROR(QUERY(Pendentes!A2:H1000,"SELECT A,B,D,E,H ORDER BY A DESC LIMIT 5 LABEL A \'Data/Hora\',B \'Workspace\',D \'Cliente\',E \'Tipo\',H \'Status\'",0),"Nenhum documento ainda")'
  );
  aba.getRange(ultsLinha + 1, 1).setNumberFormat('dd/mm/yyyy HH:mm:ss');

  // ── Formatação geral ─────────────────────────────────────────
  aba.setColumnWidth(1, 180);
  aba.setColumnWidth(2, 100);
  aba.setColumnWidth(3, 100);
  aba.setColumnWidth(4, 100);
  aba.setColumnWidth(5, 80);
  aba.setColumnWidths(6, 2, 40);

  Logger.log('Dashboard atualizado.');
  return aba;
}

// ============================================================
// ATUALIZAR TIMESTAMP DO DASHBOARD — chamado a cada trigger (leve)
// Só atualiza a célula A2; as fórmulas COUNTIFS se atualizam sozinhas
// ============================================================
function atualizarTimestampDashboard(planilha) {
  var aba = planilha.getSheetByName('Dashboard');
  if (!aba) {
    criarDashboard(planilha); // primeira vez: cria estrutura completa
    return;
  }
  var ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy 'às' HH:mm");
  aba.getRange('A2').setValue('Atualizado em: ' + ts);
}

// ============================================================
// CONFIGURAR PLANILHA — rodar UMA VEZ para criar todas as abas
// ============================================================
function configurarPlanilha() {
  var c = cfg();
  if (!c.sheetId) throw new Error('SHEET_ID não configurado.');
  var planilha = SpreadsheetApp.openById(c.sheetId);

  criarDashboard(planilha);
  criarAbaPendentes(planilha);
  criarAbaProcessados(planilha);

  Logger.log('Planilha configurada: Dashboard + Pendentes + Processados.');
}

// ============================================================
// ALERTA POR EMAIL — resume os documentos do ciclo em 1 email
// ============================================================
function enviarAlertaSumario(alertas) {
  if (!alertas || alertas.length === 0) return;

  var c      = cfg();
  var email  = c.alertEmail;
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + c.sheetId;

  var assunto = alertas.length === 1
    ? '[Novo Doc] ' + alertas[0].tipoDocumento + ' — ' + alertas[0].nomeCliente
    : '[' + alertas.length + ' Novos Docs] Recebidos agora';

  // ── Corpo texto (fallback)
  var linhasTxt = alertas.map(function(a, i) {
    return (i + 1) + '. ' + a.tipoDocumento + ' — ' + a.nomeCliente +
           '\n   ' + a.workspace + ' · ' + a.canal +
           '\n   ' + a.urlArquivo;
  });
  var corpoTxt =
    alertas.length + ' documento(s) novo(s) chegaram e estão prontos para análise.\n\n' +
    linhasTxt.join('\n\n') + '\n\n' +
    'Ver planilha: ' + sheetUrl;

  // ── Corpo HTML
  var itensHtml = alertas.map(function(a) {
    return '<div style="background:#f8f9fa;border-left:4px solid #1a237e;border-radius:4px;' +
           'padding:10px 14px;margin-bottom:8px;">' +
           '<strong style="color:#1a237e">' + a.tipoDocumento + '</strong>' +
           ' &mdash; ' + a.nomeCliente + '<br>' +
           '<span style="color:#888;font-size:12px">' + a.workspace + ' &middot; ' + a.canal + '</span><br>' +
           '<a href="' + a.urlArquivo + '" style="color:#1a237e;font-size:12px">📄 Abrir no Drive →</a>' +
           '</div>';
  }).join('');

  var corpoHtml =
    '<div style="font-family:Arial,sans-serif;max-width:560px;color:#333">' +
    '<div style="background:#1a237e;color:#fff;padding:14px 20px;border-radius:8px 8px 0 0">' +
    '<b style="font-size:15px">📄 ' + alertas.length + ' Novo(s) Documento(s) Recebido(s)</b></div>' +
    '<div style="border:1px solid #e0e0e0;border-top:none;padding:20px;border-radius:0 0 8px 8px">' +
    '<p style="margin:0 0 14px;color:#555">Prontos para análise na planilha:</p>' +
    itensHtml +
    '<hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0">' +
    '<a href="' + sheetUrl + '" style="background:#1a237e;color:#fff;padding:10px 20px;' +
    'border-radius:6px;text-decoration:none;font-size:13px">📊 Ver Planilha Completa</a>' +
    '</div></div>';

  try {
    MailApp.sendEmail({ to: email, subject: assunto, body: corpoTxt, htmlBody: corpoHtml });
    Logger.log('Alerta enviado para ' + email + ' — ' + alertas.length + ' doc(s).');
  } catch (e) {
    Logger.log('Aviso: alerta email falhou: ' + e.message);
  }

  // Envia cópias para emailExtra por workspace (ex: previdenciario@ para LOAS)
  var porEmail = {};
  alertas.forEach(function(a) {
    if (a.emailExtra) {
      if (!porEmail[a.emailExtra]) porEmail[a.emailExtra] = [];
      porEmail[a.emailExtra].push(a);
    }
  });
  Object.keys(porEmail).forEach(function(emailDest) {
    var grupo    = porEmail[emailDest];
    var assuntoE = grupo.length === 1
      ? '[Doc] ' + grupo[0].tipoDocumento + ' — ' + grupo[0].nomeCliente
      : '[' + grupo.length + ' Docs] ' + grupo[0].workspace;
    var itensE = grupo.map(function(a) {
      return '<div style="background:#f8f9fa;border-left:4px solid #1a237e;border-radius:4px;' +
             'padding:10px 14px;margin-bottom:8px;">' +
             '<strong style="color:#1a237e">' + a.tipoDocumento + '</strong>' +
             ' &mdash; ' + a.nomeCliente + '<br>' +
             '<a href="' + a.urlArquivo + '" style="color:#1a237e;font-size:12px">📄 Abrir no Drive →</a>' +
             '</div>';
    }).join('');
    var htmlE =
      '<div style="font-family:Arial,sans-serif;max-width:560px;color:#333">' +
      '<div style="background:#1a237e;color:#fff;padding:14px 20px;border-radius:8px 8px 0 0">' +
      '<b>' + grupo[0].workspace + ' — ' + grupo.length + ' Novo(s) Documento(s)</b></div>' +
      '<div style="border:1px solid #e0e0e0;border-top:none;padding:20px;border-radius:0 0 8px 8px">' +
      itensE + '</div></div>';
    var txtE = grupo.map(function(a, i) {
      return (i+1) + '. ' + a.tipoDocumento + ' — ' + a.nomeCliente + '\n   ' + a.urlArquivo;
    }).join('\n\n');
    try {
      MailApp.sendEmail({ to: emailDest, subject: assuntoE, body: txtE, htmlBody: htmlE });
      Logger.log('Alerta extra enviado para ' + emailDest + ' — ' + grupo.length + ' doc(s).');
    } catch (e) {
      Logger.log('Aviso: alerta extra falhou para ' + emailDest + ': ' + e.message);
    }
  });
}

// ============================================================
// IDENTIFICAR TIPO POR NOME — heurística para PDFs
// ============================================================
function identificarTipoPorNome(nome) {
  var nomeLower = nome.toLowerCase();

  for (var i = 0; i < TIPOS_DOCUMENTO.length; i++) {
    var def = TIPOS_DOCUMENTO[i];
    if (def.palavras.length === 0) continue;
    for (var j = 0; j < def.palavras.length; j++) {
      if (nomeLower.indexOf(def.palavras[j]) !== -1) return def.tipo;
    }
  }

  return 'Documento';
}

// ============================================================
// ENCONTRAR PASTA — utilitário para localizar pasta raiz no Drive
// ============================================================
function encontrarPasta() {
  Logger.log('Buscando pasta: "' + PASTA_NOME + '"');
  var iter = DriveApp.getFoldersByName(PASTA_NOME);

  if (iter.hasNext()) {
    var pasta = iter.next();
    Logger.log('Pasta encontrada: ' + pasta.getName() + ' | ID: ' + pasta.getId());
    return pasta;
  } else {
    Logger.log('Pasta NÃO encontrada. Será criada quando o primeiro documento for processado.');
    return null;
  }
}

// ============================================================
// TESTAR CONFIGURAÇÃO — verifica se todas as chaves estão presentes
// ============================================================
function testarConfiguracao() {
  Logger.log('=== Teste de Configuração ===');

  var c  = cfg();
  var ok = true;

  function checar(label, valor) {
    if (!valor) {
      Logger.log('❌ ' + label + ': NÃO configurado');
      ok = false;
    } else {
      Logger.log('✅ ' + label + ': OK (***' + valor.slice(-4) + ')');
    }
  }

  checar('GEMINI_API_KEY',       c.geminiKey);
  checar('SHEET_ID',             c.sheetId);
  checar('VERCEL_PROCESS_URL',   c.vercelProcessUrl);
  checar('VERCEL_PROCESS_KEY',   c.vercelProcessKey);

  if (c.sheetId)           Logger.log('  (sheet id: '      + c.sheetId + ')');
  if (c.vercelProcessUrl)  Logger.log('  (process url: '   + c.vercelProcessUrl + ')');

  if (c.sheetId) {
    try {
      var pl = SpreadsheetApp.openById(c.sheetId);
      Logger.log('✅ Planilha acessível: ' + pl.getName());
    } catch (e) {
      Logger.log('❌ Planilha NÃO acessível: ' + e.message);
      ok = false;
    }
  }

  try {
    var threads = GmailApp.search(QUERY_EMAIL, 0, 1);
    Logger.log('✅ Gmail acessível. Threads na query: ' + threads.length);
  } catch (e) {
    Logger.log('❌ Gmail NÃO acessível: ' + e.message);
    ok = false;
  }

  try {
    encontrarPasta();
    Logger.log('✅ Drive acessível.');
  } catch (e) {
    Logger.log('❌ Drive NÃO acessível: ' + e.message);
    ok = false;
  }

  Logger.log(ok ? '=== Todas as configurações OK ===' : '=== ATENÇÃO: configure as propriedades faltantes em Projeto > Propriedades do script ===');
}

// ============================================================
// TESTAR COM IMAGEM — testa o fluxo completo com arquivo do Drive
// File ID fixo para teste: '1-IyaR2kzfvjxm-eE9T6gkQWKm4Zf8p0L'
// ============================================================
function testarComImagem() {
  Logger.log('=== Teste com Imagem ===');

  var fileId          = '1-IyaR2kzfvjxm-eE9T6gkQWKm4Zf8p0L';
  var nomeClienteTeste = 'TESTE_SISTEMA';

  try {
    var arquivo     = DriveApp.getFileById(fileId);
    var blob        = arquivo.getBlob();
    var mimeType    = arquivo.getMimeType();
    var nomeOriginal = arquivo.getName();

    Logger.log('Arquivo: ' + nomeOriginal + ' | Tipo: ' + mimeType);

    var anexoMock = {
      getName:        function() { return nomeOriginal; },
      getContentType: function() { return mimeType; },
      copyBlob:       function() { return blob; },
      getBytes:       function() { return blob.getBytes(); }
    };

    tratarDocumento(anexoMock, nomeClienteTeste, 'teste@rogeriaoliveira.com');

    Logger.log('=== Teste com imagem CONCLUÍDO com sucesso ===');

  } catch (e) {
    Logger.log('ERRO no teste com imagem: ' + e.message);
    Logger.log('Stack: ' + e.stack);
  }
}

// ============================================================
// ============================================================
// CANAL 2 — WHATSAPP VIA LIDERHUB API
// ============================================================
// ============================================================

// ============================================================
// LER WORKSPACES — lê, normaliza e retorna o array de workspaces
// Remove espaços/quebras de linha inseridos pelo editor de Script Properties
// ============================================================
function lerWorkspaces() {
  var raw = PropertiesService.getScriptProperties().getProperty('LIDERHUB_WORKSPACES');
  if (!raw) {
    Logger.log('LIDERHUB_WORKSPACES não configurado nas Script Properties.');
    return null;
  }
  try {
    var limpo = raw.replace(/[\r\n]+/g, '').replace(/\s{2,}/g, ' ');
    return JSON.parse(limpo).map(function(ws) {
      return {
        id:         (ws.id         || '').replace(/\s/g, ''),
        key:        (ws.key        || '').replace(/\s/g, ''),
        nome:       (ws.nome       || '').trim().replace(/\s{2,}/g, ' '),
        pasta:      (ws.pasta      || '').trim(),
        pastaId:    (ws.pastaId    || '').replace(/\s/g, ''),
        tagId:      (ws.tagId      || '').replace(/\s/g, ''),
        emailExtra: (ws.emailExtra || '').trim()
      };
    });
  } catch (e) {
    Logger.log('ERRO ao parsear LIDERHUB_WORKSPACES: ' + e.message);
    return null;
  }
}

// ============================================================
// INSTALAR TRIGGER LIDERHUB — executa verificarLiderHub a cada 15 minutos
// Rodar UMA VEZ manualmente no Apps Script Editor
// ============================================================
function instalarTriggerLiderHub() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'verificarLiderHub') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('verificarLiderHub')
    .timeBased()
    .everyMinutes(15)
    .create();
  Logger.log('Trigger instalado: verificarLiderHub a cada 15 minutos.');
}

// ============================================================
// VERIFICAR LIDERHUB — ponto de entrada do canal WhatsApp
// Lê LIDERHUB_WORKSPACES das Script Properties (JSON array)
// ============================================================
function verificarLiderHub() {
  _processadosCache = null; // reseta cache a cada execução do trigger
  _alertasBuffer    = [];   // reseta buffer de alertas
  Logger.log('=== verificarLiderHub iniciado ===');

  var workspaces = lerWorkspaces();
  if (!workspaces) return;

  for (var i = 0; i < workspaces.length; i++) {
    try {
      processarWorkspace(workspaces[i]);
    } catch (e) {
      Logger.log('ERRO no workspace "' + workspaces[i].nome + '": ' + e.message);
    }
  }

  // Atualiza apenas o timestamp do Dashboard (fórmulas COUNTIFS se atualizam sozinhas)
  try {
    var c = cfg();
    if (c.sheetId) atualizarTimestampDashboard(SpreadsheetApp.openById(c.sheetId));
  } catch (e) {
    Logger.log('Aviso: não foi possível atualizar Dashboard: ' + e.message);
  }

  // Envia alerta agrupado se houver documentos novos neste ciclo
  enviarAlertaSumario(_alertasBuffer);
  _alertasBuffer = [];

  Logger.log('=== verificarLiderHub concluído ===');
}

// ============================================================
// PROCESSAR WORKSPACE — um workspace por execução
// ============================================================
function processarWorkspace(workspace) {
  Logger.log('--- Workspace: ' + workspace.nome + ' ---');

  var props      = PropertiesService.getScriptProperties();
  var lastRunKey = 'LIDERHUB_LAST_RUN_' + workspace.id;
  var lastRun    = props.getProperty(lastRunKey);

  // Na primeira execução, olha para as últimas 48h para capturar docs enviados antes da tag
  if (!lastRun) {
    lastRun = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    Logger.log('Primeira execução — usando janela de 48h: ' + lastRun);
  }

  var c        = cfg();
  var planilha = SpreadsheetApp.openById(c.sheetId);

  var novaUltimaRun = new Date().toISOString();
  var contatos      = buscarContatosRecentes(workspace, lastRun);
  Logger.log('Contatos com atividade recente: ' + contatos.length);

  var totalDocs = 0;

  for (var i = 0; i < contatos.length; i++) {
    var contato     = contatos[i];
    var nomeContato = contato.contactName
      ? contato.contactName.trim()
      : (contato.contactNumber || 'Contato Desconhecido');

    var mensagens = buscarMensagensMidia(workspace, contato.id);

    for (var j = 0; j < mensagens.length; j++) {
      var msg = mensagens[j];
      if (isMensagemProcessada(planilha, msg.id)) {
        Logger.log('[Dedup] Pulando mensagem já processada: ' + msg.id);
        continue;
      }
      try {
        processarMensagemMidia(msg, nomeContato, workspace, planilha);
        totalDocs++;
      } catch (e) {
        Logger.log('ERRO na mensagem ' + msg.id + ': ' + e.message);
      }
      Utilities.sleep(400); // respeita rate limit 3 req/s
    }
  }

  Logger.log('Workspace "' + workspace.nome + '" — docs processados: ' + totalDocs);
  props.setProperty(lastRunKey, novaUltimaRun);
}

// ============================================================
// BUSCAR CONTATOS RECENTES — modifiedAfter = última execução
// ============================================================
function buscarContatosRecentes(workspace, modifiedAfter) {
  var todos = [];
  var page  = 1;

  do {
    var url = LIDERHUB_BASE_URL + '/v1/contacts'
      + '?limit=100'
      + '&page=' + page
      + '&modifiedAfter=' + encodeURIComponent(modifiedAfter)
      + (workspace.tagId ? '&tags=' + encodeURIComponent(workspace.tagId) : '');

    var resp = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'x-company-key': workspace.key },
      muteHttpExceptions: true
    });

    if (resp.getResponseCode() !== 200) {
      Logger.log('ERRO GET /v1/contacts HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText());
      break;
    }

    var json = JSON.parse(resp.getContentText());
    if (!json.contacts || json.contacts.length === 0) break;

    todos = todos.concat(json.contacts);

    if (!json.pagination || !json.pagination.hasNextPage) break;
    page++;
    Utilities.sleep(400);

  } while (true);

  return todos;
}

// ============================================================
// BUSCAR MENSAGENS COM MÍDIA — filtra por timestamp e outbound=false
// ============================================================
function buscarMensagensMidia(workspace, contactId) {
  var url = LIDERHUB_BASE_URL + '/v1/message'
    + '?contact=' + contactId
    + '&limit=50&page=1';

  var resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'x-company-key': workspace.key },
    muteHttpExceptions: true
  });

  if (resp.getResponseCode() !== 200) {
    Logger.log('ERRO GET /v1/message HTTP ' + resp.getResponseCode());
    return [];
  }

  var json      = JSON.parse(resp.getContentText());
  var mensagens = json.messages || [];
  var comMidia  = [];

  // Tipos aceitos: imagens, PDFs e documentos Word — áudio e vídeo são ignorados
  var TIPOS_ACEITOS = ['image', 'document'];

  for (var i = 0; i < mensagens.length; i++) {
    var msg = mensagens[i];

    if (msg.outbound)                         continue; // ignorar mensagens enviadas pelo escritório
    if (!msg.mediaUrl || msg.mediaUrl === '') continue; // sem mídia
    if (TIPOS_ACEITOS.indexOf(msg.type) === -1) continue; // ignora áudio, vídeo e outros

    comMidia.push(msg);
  }

  return comMidia;
}

// ============================================================
// PROCESSAR MENSAGEM COM MÍDIA — baixa e envia ao pipeline
// ============================================================
function processarMensagemMidia(msg, nomeContato, workspace, planilha) {
  Logger.log('[LiderHub] Baixando: ' + msg.type + ' | ' + msg.mediaUrl);

  // Tenta baixar sem autenticação primeiro (URL pública da mídia)
  var resp = UrlFetchApp.fetch(msg.mediaUrl, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  // Se exigir autenticação, tenta com a chave do workspace
  if (resp.getResponseCode() === 401 || resp.getResponseCode() === 403) {
    resp = UrlFetchApp.fetch(msg.mediaUrl, {
      headers: { 'x-company-key': workspace.key },
      muteHttpExceptions: true,
      followRedirects: true
    });
  }

  if (resp.getResponseCode() !== 200) {
    throw new Error('Falha ao baixar mídia: HTTP ' + resp.getResponseCode());
  }

  var blob     = resp.getBlob();
  var mimeType = blob.getContentType() || inferirMimeType(msg.type);
  blob.setContentType(mimeType);

  // Nome do arquivo baseado no tipo e timestamp
  var ext       = mimeType.split('/')[1] || 'bin';
  var nomeFinal = msg.type + '_' + new Date(msg.createdAt).getTime() + '.' + ext;
  blob.setName(nomeFinal);

  // Mock de anexo compatível com o pipeline existente
  var blobFinal = blob;
  var anexoMock = {
    getName:        function() { return nomeFinal; },
    getContentType: function() { return mimeType; },
    copyBlob:       function() { return blobFinal; },
    getBytes:       function() { return blobFinal.getBytes(); }
  };

  var tipo = tratarDocumentoWorkspace(anexoMock, nomeContato, 'WhatsApp: ' + nomeContato, workspace, workspace.nome, planilha);

  // Registra ID da mensagem como processado — evita duplicatas em execuções futuras
  marcarMensagemProcessada(planilha, msg.id, nomeContato, workspace.nome, tipo);
}

// ============================================================
// INFERIR MIME TYPE — fallback quando Content-Type ausente
// ============================================================
function inferirMimeType(tipo) {
  var mapa = {
    'image':    'image/jpeg',
    'document': 'application/pdf'
  };
  return mapa[tipo] || 'application/octet-stream';
}

// ============================================================
// TRATAR DOCUMENTO WORKSPACE — pipeline completo com pasta de workspace
// ============================================================
function tratarDocumentoWorkspace(anexo, nomeCliente, remetente, wsObj, nomeWorkspace, planilha) {
  var nomeOriginal = anexo.getName();
  var mimeType     = anexo.getContentType();
  Logger.log('[LiderHub] Tratando: ' + nomeOriginal + ' (' + mimeType + ')');

  // ── Salva original imediatamente (fail-safe) ─────────────────
  var ext         = (mimeType.split('/')[1] || 'bin').split(';')[0];
  var nomeArqOrig = 'orig_' + new Date().getTime() + '.' + ext;
  try {
    salvarOriginalNoDriveWorkspace(anexo.copyBlob(), nomeCliente, wsObj, nomeArqOrig);
  } catch (e) {
    Logger.log('Aviso: não salvou original: ' + e.message);
  }

  var nomeFinal, blob, tipo;

  if (mimeType === 'application/pdf') {
    tipo      = identificarTipoPorNome(nomeOriginal);
    nomeFinal = tipo + '.pdf';
    blob      = anexo.copyBlob().setName(nomeFinal);

  } else if (mimeType.indexOf('image/') === 0) {
    var bytes   = anexo.copyBlob().getBytes();
    var base64  = Utilities.base64Encode(bytes);
    var analise = analisarComGemini(base64, mimeType);
    tipo        = analise.tipo    || 'Documento';
    var angulo  = analise.rotacao || 0;

    try {
      var blobLimpo = processarImagemViaVercel(anexo.copyBlob(), mimeType, angulo);
      blob      = converterParaPdf(blobLimpo, tipo);
      nomeFinal = tipo + '.pdf';
    } catch (e) {
      Logger.log('Aviso: Vercel falhou, convertendo original: ' + e.message);
      blob      = converterParaPdf(anexo.copyBlob(), tipo);
      nomeFinal = tipo + '_original.pdf';
    }

  } else {
    tipo      = 'Documento';
    nomeFinal = 'Documento_' + nomeOriginal;
    blob      = anexo.copyBlob().setName(nomeFinal);
  }

  var arquivo = salvarNoDriveWorkspace(blob, nomeCliente, wsObj);
  registrarNaPlanilha(nomeCliente, nomeFinal, tipo, arquivo.getUrl(), remetente, nomeWorkspace, 'WhatsApp', planilha, wsObj.emailExtra || '');
  Logger.log('[LiderHub] Editado salvo: ' + arquivo.getName() + ' | ' + arquivo.getUrl());
  return tipo;
}

// ============================================================
// SALVAR NO DRIVE WORKSPACE — acessa pasta diretamente por ID
// ============================================================
function salvarNoDriveWorkspace(blob, nomeCliente, workspace) {
  var pastaWs   = obterPastaWorkspaceDrive(workspace);
  var pastaCli  = obterOuCriarSubpasta(pastaWs, nomeCliente);
  var pastaEdit = obterOuCriarSubpasta(pastaCli, 'Editado');
  var arquivo   = pastaEdit.createFile(blob);
  Logger.log('[LiderHub] Editado: ' + pastaWs.getName() + '/' + nomeCliente + '/Editado/' + arquivo.getName());
  return arquivo;
}

function salvarOriginalNoDriveWorkspace(blob, nomeCliente, workspace, nomeArquivo) {
  blob.setName(nomeArquivo);
  var pastaWs   = obterPastaWorkspaceDrive(workspace);
  var pastaCli  = obterOuCriarSubpasta(pastaWs, nomeCliente);
  var pastaOrig = obterOuCriarSubpasta(pastaCli, 'Original');
  var arquivo   = pastaOrig.createFile(blob);
  Logger.log('[LiderHub] Original: ' + pastaWs.getName() + '/' + nomeCliente + '/Original/' + arquivo.getName());
  return arquivo;
}

// ============================================================
// OBTER OU CRIAR SUBPASTA — helper para criar Original/Editado
// ============================================================
function obterOuCriarSubpasta(pastaPai, nomeSub) {
  var iter = pastaPai.getFoldersByName(nomeSub);
  return iter.hasNext() ? iter.next() : pastaPai.createFolder(nomeSub);
}

// ============================================================
// PROCESSAR IMAGEM VIA VERCEL — substitui Cloudinary
// Recebe blob bruto, retorna JPEG limpo (rotacionado + crop + realce)
// ============================================================
function processarImagemViaVercel(blob, mimeType, angulo) {
  var c = cfg();
  if (!c.vercelProcessUrl || !c.vercelProcessKey) {
    throw new Error('VERCEL_PROCESS_URL ou VERCEL_PROCESS_KEY não configurado nas Script Properties.');
  }

  var bytes  = blob.getBytes();
  var base64 = Utilities.base64Encode(bytes);

  var resp = UrlFetchApp.fetch(c.vercelProcessUrl, {
    method:      'post',
    contentType: 'application/json',
    payload:     JSON.stringify({ image: base64, mimeType: mimeType, angulo: angulo }),
    headers:     { 'x-api-key': c.vercelProcessKey },
    muteHttpExceptions: true
  });

  if (resp.getResponseCode() !== 200) {
    throw new Error('process-document HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText().slice(0, 200));
  }

  var json = JSON.parse(resp.getContentText());
  if (!json.image) throw new Error('Resposta inválida: campo image ausente.');

  var outputBytes = Utilities.base64Decode(json.image);
  return Utilities.newBlob(outputBytes, 'image/jpeg', 'processado.jpg');
}

// ============================================================
// WEB APP — página de acionamento manual para o comercial
// Deploy: Implantar > Novo deployment > Web App
//   Executar como: Eu  |  Acesso: Qualquer pessoa
// ============================================================
function doGet() {
  var html =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Documentos Históricos</title>' +
    '<style>' +
    'body{font-family:sans-serif;max-width:460px;margin:60px auto;padding:0 20px;color:#333}' +
    'h2{font-size:1.15rem;margin-bottom:6px}' +
    'p{font-size:.88rem;color:#666;margin-bottom:24px}' +
    'button{background:#1a73e8;color:#fff;border:none;padding:13px 0;border-radius:6px;' +
    'font-size:1rem;cursor:pointer;width:100%}' +
    'button:disabled{background:#aaa;cursor:not-allowed}' +
    '#st{margin-top:18px;font-size:.88rem;padding:12px;border-radius:6px;display:none}' +
    '.run{background:#e8f0fe;color:#1a73e8}' +
    '.ok{background:#e6f4ea;color:#137333}' +
    '.err{background:#fce8e6;color:#c5221f}' +
    '</style></head><body>' +
    '<h2>Baixar Documentos Históricos</h2>' +
    '<p>Baixa todos os arquivos das conversas marcadas com a tag <strong>salvar-documentos</strong> no LiderHub.</p>' +
    '<button id="btn" onclick="run()">Iniciar Download</button>' +
    '<div id="st"></div>' +
    '<script>' +
    'function run(){' +
    '  var b=document.getElementById("btn"),s=document.getElementById("st");' +
    '  b.disabled=true;b.textContent="Processando...";' +
    '  s.className="run";s.style.display="block";s.textContent="Buscando documentos... pode levar alguns minutos.";' +
    '  google.script.run' +
    '    .withSuccessHandler(function(r){b.disabled=false;b.textContent="Iniciar Download";s.className="ok";s.textContent=r;})' +
    '    .withFailureHandler(function(e){b.disabled=false;b.textContent="Iniciar Download";s.className="err";s.textContent="Erro: "+e.message;})' +
    '    .baixarDocumentosHistoricos();' +
    '}' +
    '</script></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Documentos Históricos');
}

// ============================================================
// BAIXAR DOCUMENTOS HISTÓRICOS — ponto de entrada da Web App
// Sem filtro de data — processa tudo que tiver a tag salvar-documentos
// ============================================================
function baixarDocumentosHistoricos() {
  var props = PropertiesService.getScriptProperties();
  var workspacesJson = props.getProperty('LIDERHUB_WORKSPACES');

  if (!workspacesJson) throw new Error('LIDERHUB_WORKSPACES não configurado.');

  var workspaces;
  try {
    workspaces = JSON.parse(workspacesJson);
  } catch (e) {
    throw new Error('LIDERHUB_WORKSPACES inválido: ' + e.message);
  }

  var totalDocs = 0;

  for (var i = 0; i < workspaces.length; i++) {
    var ws = workspaces[i];
    if (!ws.tagId) {
      Logger.log('Workspace "' + ws.nome + '" sem tagId — ignorado.');
      continue;
    }
    try {
      totalDocs += baixarHistoricoWorkspace(ws);
    } catch (e) {
      Logger.log('ERRO workspace "' + ws.nome + '": ' + e.message);
    }
  }

  var msg = 'Concluído. ' + totalDocs + ' documento(s) processado(s).';
  Logger.log(msg);
  return msg;
}

// ============================================================
// BAIXAR HISTÓRICO DE UM WORKSPACE
// ============================================================
function baixarHistoricoWorkspace(workspace) {
  Logger.log('=== Histórico: ' + workspace.nome + ' ===');

  var contatos  = buscarContatosComTag(workspace);
  var totalDocs = 0;

  Logger.log('Contatos tagados: ' + contatos.length);

  for (var i = 0; i < contatos.length; i++) {
    var contato     = contatos[i];
    var nomeContato = contato.contactName
      ? contato.contactName.trim()
      : (contato.contactNumber || 'Contato Desconhecido');

    var mensagens = buscarTodasMensagensMidia(workspace, contato.id);

    for (var j = 0; j < mensagens.length; j++) {
      try {
        processarMensagemMidia(mensagens[j], nomeContato, workspace);
        totalDocs++;
      } catch (e) {
        Logger.log('ERRO mensagem ' + mensagens[j].id + ': ' + e.message);
      }
      Utilities.sleep(400);
    }
  }

  Logger.log('Histórico "' + workspace.nome + '" — docs: ' + totalDocs);
  return totalDocs;
}

// ============================================================
// BUSCAR CONTATOS COM TAG — sem filtro de data
// ============================================================
function buscarContatosComTag(workspace) {
  var todos = [];
  var page  = 1;

  do {
    var url = LIDERHUB_BASE_URL + '/v1/contacts'
      + '?limit=100'
      + '&page=' + page
      + '&tags=' + encodeURIComponent(workspace.tagId);

    var resp = UrlFetchApp.fetch(url, {
      method:           'get',
      headers:          { 'x-company-key': workspace.key },
      muteHttpExceptions: true
    });

    if (resp.getResponseCode() !== 200) {
      Logger.log('ERRO GET /v1/contacts HTTP ' + resp.getResponseCode());
      break;
    }

    var json = JSON.parse(resp.getContentText());
    if (!json.contacts || json.contacts.length === 0) break;

    todos = todos.concat(json.contacts);

    if (!json.pagination || !json.pagination.hasNextPage) break;
    page++;
    Utilities.sleep(400);

  } while (true);

  return todos;
}

// ============================================================
// BUSCAR TODAS AS MENSAGENS COM MÍDIA — sem filtro de data
// ============================================================
function buscarTodasMensagensMidia(workspace, contactId) {
  var url = LIDERHUB_BASE_URL + '/v1/message'
    + '?contact=' + contactId
    + '&limit=50&page=1';

  var resp = UrlFetchApp.fetch(url, {
    method:           'get',
    headers:          { 'x-company-key': workspace.key },
    muteHttpExceptions: true
  });

  if (resp.getResponseCode() !== 200) return [];

  var json      = JSON.parse(resp.getContentText());
  var mensagens = json.messages || json.data || [];
  var comMidia  = [];

  for (var i = 0; i < mensagens.length; i++) {
    var msg = mensagens[i];
    if (msg.outbound)                         continue;
    if (!msg.mediaUrl || msg.mediaUrl === '') continue;
    if (msg.type === 'conversation')          continue;
    comMidia.push(msg);
  }

  return comMidia;
}

// ============================================================
// TESTAR LIDERHUB — verifica conectividade e lista contatos recentes
// Rodar manualmente para validar chaves antes de ativar o trigger
// ============================================================
function testarLiderHub() {
  Logger.log('=== Teste LiderHub ===');

  var workspaces = lerWorkspaces();
  if (!workspaces) return;
  Logger.log('Workspaces configurados: ' + workspaces.length);

  for (var i = 0; i < workspaces.length; i++) {
    var ws  = workspaces[i];
    var url = LIDERHUB_BASE_URL + '/v1/contacts?limit=5&page=1';

    Logger.log('--- Testando: ' + ws.nome + ' ---');

    var resp = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'x-company-key': ws.key },
      muteHttpExceptions: true
    });

    if (resp.getResponseCode() === 200) {
      var json = JSON.parse(resp.getContentText());
      Logger.log('✅ ' + ws.nome + ' OK — total contatos: ' + (json.pagination ? json.pagination.total : '?'));
    } else {
      Logger.log('❌ ' + ws.nome + ' ERRO HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText());
    }

    Utilities.sleep(500);
  }

  Logger.log('=== Teste LiderHub concluído ===');
}

function debugWorkspaces() {
  var props = PropertiesService.getScriptProperties();
  var json  = props.getProperty('LIDERHUB_WORKSPACES');
  var ws    = JSON.parse(json);
  for (var i = 0; i < ws.length; i++) {
    Logger.log(ws[i].nome + ' | key length: ' + ws[i].key.length + ' | key: [' + ws[i].key + ']');
  }
}
