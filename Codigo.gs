// ============================================================
// SISTEMA ROGÉRIA — Legal Ops
// Google Apps Script — Código.gs
// Captura e tratamento de documentos para escritório de advocacia
// ============================================================

// ---- CONSTANTES GERAIS ----
var PASTA_NOME   = 'ARQUIVOS CLIENTES / EMAIL E LIDERHUB';
var QUERY_EMAIL  = 'to:documentos@rogeriaoliveira.com has:attachment is:unread';
var GEMINI_MODEL = 'gemini-2.5-flash';

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
    cloudinaryCloud:  props.getProperty('CLOUDINARY_CLOUD_NAME'),
    cloudinaryApiKey: props.getProperty('CLOUDINARY_API_KEY'),
    cloudinarySecret: props.getProperty('CLOUDINARY_API_SECRET'),
    sheetId:          props.getProperty('SHEET_ID')
  };
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

  var nomeFinal, blob, tipo;

  if (mimeType === 'application/pdf') {
    // PDF recebido: apenas renomeia pelo tipo
    tipo      = identificarTipoPorNome(nomeOriginal);
    nomeFinal = tipo + '.pdf';
    blob      = anexo.copyBlob().setName(nomeFinal);

  } else if (mimeType.indexOf('image/') === 0) {
    // IMAGEM: processa com Gemini + Cloudinary e converte para PDF
    var resultado = tratarNoCloudinary(anexo, nomeOriginal, mimeType);
    tipo          = resultado.tipo;
    blob          = converterParaPdf(resultado.blob, tipo);
    nomeFinal     = tipo + '.pdf';

  } else {
    // Outros formatos: salva como está
    tipo      = 'Documento';
    nomeFinal = 'Documento_' + nomeOriginal;
    blob      = anexo.copyBlob().setName(nomeFinal);
  }

  var arquivo = salvarNoDrive(blob, nomeCliente);
  registrarNaPlanilha(nomeCliente, nomeFinal, tipo, arquivo.getUrl(), remetente);
  Logger.log('Salvo: ' + arquivo.getName() + ' — ' + arquivo.getUrl());
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
  var pasta   = obterOuCriarPasta(nomeCliente);
  var arquivo = pasta.createFile(blob);
  Logger.log('Arquivo criado no Drive: ' + arquivo.getName() + ' | Pasta: ' + pasta.getName());
  return arquivo;
}

// ============================================================
// OBTER OU CRIAR PASTA — hierarquia: PASTA_NOME / nomeCliente
// ============================================================
function obterOuCriarPasta(nomeCliente) {
  var iter = DriveApp.getFoldersByName(PASTA_NOME);
  var pastaRaiz;

  if (iter.hasNext()) {
    pastaRaiz = iter.next();
  } else {
    pastaRaiz = DriveApp.createFolder(PASTA_NOME);
    Logger.log('Pasta raiz criada: ' + PASTA_NOME);
  }

  var subIter = pastaRaiz.getFoldersByName(nomeCliente);
  var subPasta;

  if (subIter.hasNext()) {
    subPasta = subIter.next();
  } else {
    subPasta = pastaRaiz.createFolder(nomeCliente);
    Logger.log('Subpasta criada: ' + nomeCliente);
  }

  return subPasta;
}

// ============================================================
// REGISTRAR NA PLANILHA — aba 'Pendentes'
// ============================================================
function registrarNaPlanilha(nomeCliente, nomeArquivo, tipoDocumento, urlArquivo, remetente) {
  var c = cfg();
  if (!c.sheetId) throw new Error('SHEET_ID não configurado.');

  var planilha = SpreadsheetApp.openById(c.sheetId);
  var aba      = criarAbaPendentes(planilha);
  var dataHora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

  aba.appendRow([dataHora, nomeCliente, tipoDocumento, nomeArquivo, urlArquivo, remetente, 'Pendente']);
  Logger.log('Registrado na planilha: ' + nomeCliente + ' | ' + tipoDocumento);
}

// ============================================================
// CRIAR ABA PENDENTES — cria se não existir, garante cabeçalho
// ============================================================
function criarAbaPendentes(planilha) {
  var aba = planilha.getSheetByName('Pendentes');

  if (!aba) {
    aba = planilha.insertSheet('Pendentes');
    aba.appendRow(['Data/Hora', 'Cliente', 'Tipo de Documento', 'Nome do Arquivo', 'Link no Drive', 'Remetente', 'Status']);
    aba.getRange(1, 1, 1, 7)
      .setFontWeight('bold')
      .setBackground('#4a86e8')
      .setFontColor('#ffffff');
    aba.setFrozenRows(1);
    Logger.log('Aba "Pendentes" criada.');
  }

  return aba;
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

  checar('GEMINI_API_KEY',      c.geminiKey);
  checar('CLOUDINARY_CLOUD_NAME', c.cloudinaryCloud  ? c.cloudinaryCloud  : null);
  checar('CLOUDINARY_API_KEY',  c.cloudinaryApiKey);
  checar('CLOUDINARY_API_SECRET', c.cloudinarySecret);
  checar('SHEET_ID',            c.sheetId);

  if (c.cloudinaryCloud) Logger.log('  (cloud name: ' + c.cloudinaryCloud + ')');
  if (c.sheetId)         Logger.log('  (sheet id: '   + c.sheetId + ')');

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
