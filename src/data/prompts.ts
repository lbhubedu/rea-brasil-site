export type PromptSection = {
  id: string;
  number: string;
  title: string;
  description: string;
  warning?: string;
};

export type ReaPrompt = {
  id: string;
  section: string;
  title: string;
  summary: string;
  template: string;
  level: "Comece por aqui" | "Intermediário" | "Avançado";
};

export const promptSections: PromptSection[] = [
  { id: "instalacao", number: "00", title: "Instalar e verificar", description: "Prepare o REA no seu agente e confira se as ferramentas apareceram." },
  { id: "primeiros-passos", number: "01", title: "Primeiros passos", description: "Exercícios pequenos para entender o jeito de investigar sem se perder." },
  { id: "recursos", number: "02", title: "Entender um recurso", description: "Perguntas que funcionam em quase qualquer programa: siga um botão, uma regra ou um resultado." },
  { id: "nativos", number: "03", title: "Programas de computador", description: "Explore executáveis, funções, bibliotecas, textos internos e formatos de arquivo." },
  { id: "reconstrucao", number: "04", title: "Reconstruir com sala limpa", description: "Entenda o comportamento e implemente sua própria versão sem copiar código ou recursos protegidos.", warning: "Sala limpa significa extrair comportamento, não copiar código, marca, imagens ou mecanismos de licença." },
  { id: "jogos", number: "05", title: "Jogos", description: "Recupere regras de movimento, física, pontuação, dificuldade e carregamento de fases." },
  { id: "webassembly", number: "06", title: "Jogos e WebAssembly", description: "Planeje a adaptação de um jogo para funcionar no navegador." },
  { id: "firmware", number: "07", title: "Firmware e dispositivos", description: "Examine o software interno de aparelhos sem gravar ou executar nada no início." },
  { id: "android", number: "08", title: "Android", description: "Investigue APKs, telas, chamadas de rede, armazenamento e código nativo." },
  { id: "kernel", number: "09", title: "Kernel e drivers", description: "Mapeie drivers e chamadas de sistema em análise estática, sem carregar o driver.", warning: "Use somente em sistemas próprios ou autorizados. Não carregue drivers desconhecidos na sua máquina principal." },
  { id: "seguranca", number: "10", title: "Pesquisa em segurança", description: "Auditorias defensivas que separam possibilidade, evidência e vulnerabilidade confirmada.", warning: "Uma hipótese não é uma vulnerabilidade confirmada. Valide apenas em ambiente controlado e autorizado." },
  { id: "electron", number: "11", title: "Electron e JavaScript", description: "Abra pacotes, siga recursos em código minificado e observe funcionalidades web." },
  { id: "protecao", number: "12", title: "Anti-cheat e proteção", description: "Pesquisa defensiva e revisão das proteções do seu próprio produto.", warning: "Restrinja a laboratórios, CTFs, estudos acadêmicos, bug bounty ou software próprio. Nunca use contra partidas de outras pessoas." },
  { id: "dma", number: "13", title: "DMA e hardware — defesa", description: "Entenda riscos de acesso físico à memória e melhore as defesas do seu laboratório.", warning: "Não acesse a memória de outra máquina sem autorização. Use equipamentos próprios, alvos offline e objetivo defensivo." },
  { id: "cracking", number: "14", title: "Proteções de software e CTF", description: "Estude algoritmos de validação, crackmes e mudanças de proteção sem distribuir bypass.", warning: "Documente algoritmos para estudo e interoperabilidade; não remova licenças de produtos de terceiros." },
  { id: "versoes", number: "15", title: "Comparar versões e falhas", description: "Descubra o que mudou entre duas versões e diferencie build de comportamento." },
  { id: "longas", number: "16", title: "Investigações longas", description: "Organize notas, dúvidas e próximos passos para continuar sem recomeçar." },
  { id: "curinga", number: "★", title: "Prompt curinga", description: "Se estiver em dúvida, use este modelo: ele serve para quase qualquer recurso." },
];

const p = (
  id: string,
  section: string,
  title: string,
  summary: string,
  template: string,
  level: ReaPrompt["level"] = "Intermediário",
): ReaPrompt => ({ id, section, title, summary, template, level });

export const reaPrompts: ReaPrompt[] = [
  p("instalar-rea", "instalacao", "Instalar o REA e conferir a conexão", "O primeiro comando. Ele prepara o REA no agente que você já usa e mostra o que será alterado antes da instalação.", `Instale o REA e conecte-o a este agente usando: npx rea-agents@latest setup

Primeiro, mostre o plano de instalação e as mudanças de configuração para minha aprovação. Depois da instalação, verifique a conexão e liste as ferramentas e os fluxos de trabalho disponíveis.`, "Comece por aqui"),
  p("mapa-inicial", "primeiros-passos", "Primeiro olhar para um app desconhecido", "Pede um mapa curto do programa e três bons pontos para começar, sempre com evidências.", `Use o REA para criar um mapa de <NOME OU CAMINHO DO PROGRAMA>: suas partes principais, pontos de entrada e os três recursos que vale investigar primeiro. Seja breve e apresente uma evidência para cada afirmação.`, "Comece por aqui"),
  p("exportar-csv", "primeiros-passos", "Exercício guiado: exportar notas em CSV", "Um exercício pronto com um aplicativo de exemplo. Ideal para aprender o que significa seguir um recurso do clique ao arquivo.", `Baixe https://rea.tools/examples/notes-example.zip em uma pasta nova e extraia o conteúdo.

Use o REA para investigar o que acontece quando clico em "Exportar notas". Siga o caminho desde o botão até a gravação do arquivo.

Mostre onde notes.csv é criado, quais campos ele contém e quais arquivos e funções comprovam cada etapa.`, "Comece por aqui"),
  p("explicar-recurso", "recursos", "Explicar um recurso passo a passo", "O modelo mais útil para começar: escolha apenas um recurso e peça fatos, deduções e dúvidas separados.", `Use o REA para investigar como <RECURSO> funciona em <CAMINHO DO APLICATIVO>.

Identifique o ponto de entrada, as funções envolvidas, o fluxo dos dados, as dependências e os efeitos que posso observar.

Para cada conclusão, apresente evidência: arquivo, função, endereço ou trecho relevante. Separe fatos confirmados, inferências e pontos ainda desconhecidos.

Não execute o aplicativo nesta etapa.`, "Comece por aqui"),
  p("seguir-botao", "recursos", "Seguir um botão até o resultado", "Descobre tudo o que acontece entre o clique e o momento em que algo é salvo, enviado ou exibido.", `Use o REA em <APLICATIVO>. Comece no botão <NOME DO BOTÃO> e acompanhe o que acontece até o resultado ser gravado, enviado ou exibido. Cite cada módulo ou função no caminho e explique o papel de cada um.`, "Comece por aqui"),
  p("recuperar-regra", "recursos", "Descobrir uma regra e recriá-la", "Transforma uma regra escondida em uma explicação simples e em um exemplo pequeno que você pode testar.", `Use o REA para encontrar a regra que controla <COMPORTAMENTO> em <PROGRAMA>. Escreva a regra em palavras simples, construa uma versão independente mínima que eu possa executar e forneça uma entrada que comprove que ela corresponde ao original.`, "Comece por aqui"),
  p("entender-executavel", "nativos", "Entender um executável", "Cria um panorama do programa: formato, arquitetura, bibliotecas e componentes, sem executá-lo.", `Analise <CAMINHO DO EXECUTÁVEL> com o REA.

Identifique formato, arquitetura, runtime, bibliotecas, textos relevantes e possíveis pontos de entrada.

Mapeie os componentes principais e explique suas responsabilidades com evidências. Diga qual motor de análise está disponível e quais são suas limitações.

Comece pela análise estática.`),
  p("mergulho-funcao", "nativos", "Investigar uma função em profundidade", "Mostra o pseudocódigo de uma função, quem a chama, o que ela chama e quais dados ela altera.", `Use o REA em <BINÁRIO>. Escolha a função responsável por <OPERAÇÃO> e produza: pseudocódigo descompilado, chamadores e funções chamadas, estruturas de dados lidas ou escritas e todos os textos e variáveis globais utilizados. Anote cada descoberta com o intervalo de endereços que a comprova.`, "Avançado"),
  p("triagem-binario", "nativos", "Fazer triagem sem executar o programa", "Gera um mapa de prioridades para você saber onde investigar primeiro e identificar possíveis ofuscações.", `Use o REA em <BINÁRIO>. Produza um mapa de triagem: formato e arquitetura, seções, bibliotecas e importações agrupadas por capacidade (rede, arquivos, criptografia, processos, registro/IPC), textos interessantes com endereços e melhores pontos de entrada para <RECURSO>. Sinalize empacotamento, ofuscação ou achatamento do fluxo de controle.`),
  p("formato-arquivo", "nativos", "Descobrir um formato de arquivo", "Explica cada campo de um arquivo e cria um pequeno leitor para conferir o formato na prática.", `Use o REA em <PROGRAMA> para descobrir como ele lê e grava <TIPO DE ARQUIVO>. Descreva a estrutura campo por campo, mostre onde cada campo é interpretado e escreva um pequeno leitor que imprima um arquivo de exemplo.`),
  p("extrair-protocolo", "nativos", "Recuperar um protocolo ou serialização", "Documenta os bytes trocados em rede ou entre processos e gera uma definição reutilizável.", `Use o REA em <BINÁRIO> para recuperar o formato das mensagens de rede ou IPC usadas por <RECURSO>. Mostre as funções de serialização e leitura com endereços, liste cada campo (tamanho, endianness e codificação) e produza uma definição Python struct/proto mais uma mensagem de exemplo construída com as constantes do código.`, "Avançado"),
  p("clone-completo", "reconstrucao", "Especificação completa para reconstrução limpa", "Produz um documento de comportamento de todas as telas e estados, sem copiar a implementação.", `Use o REA para estudar <APLICATIVO> como caixa-preta para uma reconstrução em sala limpa.

Produza CLONE_SPEC.md cobrindo: todos os recursos visíveis, telas e máquinas de estado; entradas, saídas e casos-limite; formatos de arquivo e protocolos; configurações e persistência; comportamentos de erro.

Para cada requisito, cite a evidência (função, endereço, texto ou requisição capturada). Marque o que não foi confirmado como DESCONHECIDO. Não copie código nem recursos: implementarei apenas a partir da especificação.`, "Avançado"),
  p("clonar-recurso", "reconstrucao", "Recriar um recurso no meu projeto", "Estuda um único comportamento e implementa uma versão nova na linguagem que você escolher.", `Use o REA para recuperar o comportamento exato de <RECURSO> em <APLICATIVO>: gatilho, entradas, etapas de processamento, saídas, efeitos colaterais e falhas.

Depois implemente <RECURSO> do zero em <MINHA LINGUAGEM OU PROJETO>, seguindo esse comportamento e criando testes derivados das regras recuperadas. Liste todas as diferenças observáveis que ainda existem entre minha versão e o original.`),
  p("validar-clone", "reconstrucao", "Comparar minha versão com o original", "Evita declarar que uma reconstrução está pronta só porque alguns exemplos funcionaram.", `Compare <MINHA IMPLEMENTAÇÃO> com o comportamento observado de <APLICATIVO ORIGINAL>.

Use verify_reconstruction, se estiver disponível. Verifique resultados, erros, limites e transições de estado.

Apresente casos aprovados, divergências e comportamentos ainda não testados. Não considere equivalência demonstrada apenas porque alguns exemplos passaram.`),
  p("clonar-interface", "reconstrucao", "Recriar interações sem copiar o visual", "Documenta atalhos, desfazer/refazer, área de transferência e comandos para reproduzir a experiência com identidade própria.", `Use o REA em <APLICATIVO> para documentar seu modelo de interação: lógica de layout, atalhos de teclado, despacho de comandos, desfazer/refazer e formatos da área de transferência. Recrie o comportamento em <MEU FRAMEWORK> usando apenas recursos visuais próprios e mantendo a semântica documentada. Mostre qual função original comprova cada regra.`),
  p("logica-jogo", "jogos", "Recuperar a lógica de um jogo", "Busca as regras de movimento, física, pontos e surgimento de elementos com as constantes que as comprovam.", `Use o REA para reconstruir <JOGO> a partir de seu executável. Recupere a lógica de jogo em C e teste-a contra o original.

Para cada mecânica (movimento, física, pontuação e surgimento de elementos), mostre a função, as constantes e o laço de atualização que comprovam a regra.`, "Avançado"),
  p("dificuldade-jogo", "jogos", "Entender velocidade ou dificuldade", "Explica por que o jogo fica mais rápido ou difícil e cria um simulador com parâmetro ajustável.", `Use o REA para inspecionar <JOGO>. Por que <DIFICULDADE OU VELOCIDADE> muda com o tempo? Mostre a regra exata e suas constantes e construa uma pequena versão independente com um parâmetro ajustável.`, "Comece por aqui"),
  p("mapa-engine", "jogos", "Mapear o motor e os recursos do jogo", "Descobre como o jogo desenha, atualiza, carrega fases e guarda seus dados.", `Use o REA em <EXECUTÁVEL OU PASTA DO JOGO>. Identifique o motor ou framework, o laço de renderização, a ordem de atualização, como fases e recursos são carregados e serializados e onde ficam os dados de jogo. Relacione cada componente a funções e endereços e descreva o carregamento passo a passo.`, "Avançado"),
  p("mod-offline", "jogos", "Localizar valores para mod offline", "Ajuda a localizar tabelas de valores em um jogo individual próprio, sem multijogador ou trapaça online.", `Use o REA em <JOGO INDIVIDUAL OFFLINE> para localizar o código que controla <ATRIBUTOS, TAXAS OU ECONOMIA>. Mostre as tabelas ou funções com endereços. Quero apenas entender onde os valores ficam para meu experimento offline pessoal — sem multijogador e sem truques de persistência.`),
  p("wasm-mapa", "webassembly", "Avaliar um jogo para WebAssembly", "Classifica o que pode ser aproveitado, o que precisa de adaptação e o que deve ser reescrito.", `Use o REA para analisar <EXECUTÁVEL OU CÓDIGO DO JOGO> como alvo de WebAssembly.

Mapeie: laço principal e ritmo dos quadros, backend gráfico, arquivos e saves, threads, áudio, entrada e APIs específicas da plataforma.

Classifique cada item como: portável como está / precisa de adaptação / deve ser reescrito. Cite as funções e chamadas que comprovam cada classificação.`, "Avançado"),
  p("wasm-plano", "webassembly", "Criar o plano de portabilidade", "Converte as descobertas em etapas concretas até chegar a uma página jogável.", `Com base nas descobertas do REA para <JOGO>, produza um plano de port para WASM:
- ferramenta de compilação e adaptações necessárias;
- conjunto mínimo de módulos a compilar;
- migração de saves para IndexedDB e recursos para fetch/streaming;
- riscos de desempenho encontrados no código nativo, com evidências;
- marcos de trabalho terminando em um index.html jogável.`, "Avançado"),
  p("wasm-nucleo", "webassembly", "Portar primeiro a lógica central", "Separa as regras do jogo dos gráficos e do sistema operacional para testar a simulação isoladamente.", `Use o REA para isolar a lógica pura de simulação de <JOGO> (física, IA e regras) da renderização e das chamadas do sistema operacional. Extraia as regras com evidências e implemente esse núcleo em C/Rust compilado para WASM, com testes que repitam entradas gravadas e comparem hashes de estado com o comportamento original.`, "Avançado"),
  p("triagem-firmware", "firmware", "Fazer triagem de uma imagem de firmware", "Mapeia partições, arquitetura, kernel e serviços sem gravar o conteúdo no aparelho.", `Use o REA para analisar <IMAGEM DE FIRMWARE>.

Identifique o formato do contêiner, extraia partições e sistemas de arquivos, relacione regiões à arquitetura e ao endereço de carga, localize kernel e rootfs e liste entradas de boot, scripts de inicialização e serviços.

Mostre offsets, observações de entropia e evidências. Comece pela análise estática; não grave nem execute nada.`, "Avançado"),
  p("firmware-mcu", "firmware", "Analisar firmware de microcontrolador ou IoT", "Procura vetores, mapa de memória, sistema operacional e drivers de periféricos.", `Use o REA em <BLOB DE FIRMWARE> para um alvo <ARM CORTEX-M, MIPS, AVR OU ESP32>.

Encontre a tabela de vetores e o reset handler, reconstrua o mapa de memória, identifique o RTOS por assinaturas e mapeie o laço principal e drivers de periféricos (UART, SPI, I2C e rádio) com endereços.`, "Avançado"),
  p("firmware-rede", "firmware", "Mapear rede e atualização do aparelho", "Investiga endpoints, atualização OTA e validação de assinatura, marcando o que ainda é hipótese.", `Use o REA em <FIRMWARE> para recuperar: uso da pilha de rede (IPs, DNS, MQTT/HTTP e portas), caminho da atualização OTA (URL, verificação de assinatura e gravação) e materiais de credencial. Para cada descoberta, forneça função/endereço e diga se foi confirmada estaticamente ou ainda é hipótese.`, "Avançado"),
  p("auditar-apk", "android", "Auditar um APK", "Lista permissões, componentes expostos, rastreadores, domínios e armazenamento sem confundir texto encontrado com comportamento observado.", `Use o REA para analisar <CAMINHO DO APK>.

Liste permissões declaradas, componentes exportados, SDKs de analytics/rastreamento, domínios encontrados e mecanismos de armazenamento local.

Para cada item, mostre a classe, método ou arquivo correspondente. Diferencie referências presentes no código de comportamentos realmente observados. Não conclua que um domínio é acessado só porque aparece em um texto.`, "Comece por aqui"),
  p("android-nativo", "android", "Seguir um recurso do Kotlin ao código nativo", "Acompanha o caminho completo entre tela Android, JNI, bibliotecas .so e o efeito final.", `Use o REA em <APK> para seguir <RECURSO> de ponta a ponta: entrada na UI (Activity, Fragment ou Composable), cadeia Java/Kotlin, fronteiras JNI, funções .so envolvidas e efeito final (rede, arquivo ou banco). Mostre classe, método e offset em cada etapa.`, "Avançado"),
  p("android-dados", "android", "Revisar armazenamento e criptografia", "Descobre onde o app guarda informações e se elas são protegidas no aparelho e na rede.", `Use o REA em <APK>. Determine como o app armazena <DADOS>: SharedPreferences, SQLite, arquivos ou keystore. Recupere criptografia embutida com a classe/método que a utiliza. Diga, com evidências, se os dados são criptografados em repouso e em trânsito e liste riscos concretos.`),
  p("android-ofuscado", "android", "Triagem de APK ofuscado ou empacotado", "Separa o que pode ser lido agora do que só aparece durante a execução.", `Use o REA em <APK> que parece ofuscado ou empacotado. Identifique o protetor por assinaturas, mapeie o que está visível estaticamente e o que fica para a execução e proponha os passos mínimos e seguros para alcançar o código DEX/nativo real para análise.`, "Avançado"),
  p("inspecionar-driver", "kernel", "Inspecionar um driver Windows ou Linux", "Mapeia inicialização, dispositivos, códigos de controle e validações sem carregar o driver.", `Use o REA em <DRIVER .SYS OU .KO>.

Identifique formato e versão do sistema, rotina de entrada, objeto de dispositivo, tabela de despacho, códigos IOCTL e validação de buffers, callbacks registrados e memória externa lida ou escrita.

Relacione cada descoberta a função/endereço. Somente análise estática — não carregue o driver.`, "Avançado"),
  p("enumerar-ioctl", "kernel", "Mapear a superfície de IOCTL", "Organiza os comandos aceitos por um driver e prioriza riscos de validação de entrada.", `Use o REA em <DRIVER>. Enumere todos os códigos de controle atendidos e, para cada um, informe o handler, validação de buffers, verificações de tamanho, pressupostos de IRQL e cópias com tamanho controlável. Classifique os handlers por risco e apresente evidências para a classificação.`, "Avançado"),
  p("syscall", "kernel", "Explicar uma chamada de sistema", "Segue uma entrada pelo kernel, destacando verificações de limites, estruturas e erros.", `Use o REA em <KERNEL OU MÓDULO> para explicar como <SUBSISTEMA OU SYSCALL> processa <ENTRADA>. Siga da entrada ao parsing, mostre verificações de limites ou sua ausência, estruturas preenchidas e caminhos de erro. Cite endereços em cada etapa.`, "Avançado"),
  p("auditoria-fronteiras", "seguranca", "Auditar fronteiras de confiança", "Uma revisão defensiva completa que prioriza entradas externas e operações sensíveis.", `Use o REA para revisar a segurança de <APLICATIVO OU BINÁRIO QUE TENHO AUTORIZAÇÃO PARA ANALISAR>.

Priorize fronteiras de confiança, entradas não confiáveis, operações privilegiadas, credenciais, IPC, arquivos e execução de comandos.

Para cada possível vulnerabilidade, apresente origem da entrada, operação sensível, caminho e verificações existentes, pré-condições, impacto, evidências, incertezas e proposta de validação controlada.

Não classifique hipótese como vulnerabilidade confirmada sem evidência suficiente.`, "Avançado"),
  p("fonte-para-sink", "seguranca", "Seguir dados externos até operações perigosas", "Conecta a origem de uma entrada ao ponto em que ela poderia causar um problema.", `Use o REA em <BINÁRIO>. Liste onde dados não confiáveis entram (rede, arquivos, IPC, terminal, área de transferência e URLs) e siga cada origem até sinks perigosos: cópias sem limite, system/exec, carregamento dinâmico, desserialização e concatenação de caminhos. Para cada caminho, mostre a cadeia de funções e a validação existente.`, "Avançado"),
  p("comparar-patch", "seguranca", "Comparar versão vulnerável e corrigida", "Mostra qual verificação foi adicionada e procura locais em que a correção pode ter ficado incompleta.", `Use o REA para comparar <VERSÃO VULNERÁVEL> e <VERSÃO CORRIGIDA> de <COMPONENTE>.

Compare as funções relevantes à segurança: qual verificação foi adicionada, onde existe o mesmo padrão sem correção e se todos os chamadores foram cobertos. Relate possíveis correções incompletas com função/endereço, marcando-as como hipóteses até validação controlada.`, "Avançado"),
  p("triagem-crash", "seguranca", "Investigar a causa de uma falha", "Organiza logs e hipóteses para encontrar o menor teste capaz de confirmar a causa.", `Use o REA para investigar esta falha em <APLICATIVO>.

Evidências disponíveis:
<STACK TRACE, LOGS, DUMP OU PASSOS PARA REPRODUZIR>

Relacione o erro às funções envolvidas, formule hipóteses e indique quais evidências sustentam cada uma. Proponha o menor experimento capaz de diferenciar as hipóteses e validar a causa.`),
  p("meus-dados", "seguranca", "Como meus dados são tratados?", "Pergunta simples para descobrir onde uma informação é guardada ou enviada e quais riscos existem.", `Tenho autorização para analisar <PROGRAMA>. Use o REA para descobrir onde ele armazena ou envia <TIPO DE DADO>. Mostre os caminhos no código, diga se os dados são criptografados em repouso e em trânsito e liste riscos concretos com evidências.`, "Comece por aqui"),
  p("anatomia-electron", "electron", "Entender a anatomia de um app Electron", "Mapeia processos principal e visual, scripts de preload, canais IPC e um recurso escolhido.", `Use o REA para analisar <CAMINHO DO APP ELECTRON>.

Localize arquivos JavaScript e pacotes app.asar. Mapeie processos main e renderer, scripts preload e canais IPC.

Depois siga <RECURSO> da interface até sua implementação, incluindo rede e arquivos. Mostre as evidências.`),
  p("seguranca-ipc", "electron", "Revisar IPC e isolamento de contexto", "Verifica se dados da interface chegam a funções privilegiadas sem validação.", `Use o REA em <APP ELECTRON>. Enumere handlers ipcMain e canais expostos por contextBridge/preload. Para cada canal, informe argumentos, acesso a shell.openExternal, child_process, fs ou navegação webview e validações existentes. Sinalize entradas controladas pelo renderer que alcançam sinks privilegiados sem verificação, com arquivo e função.`, "Avançado"),
  p("javascript-minificado", "electron", "Seguir um recurso em JavaScript minificado", "Recupera nomes úteis, módulos e fluxo de dados mesmo em um bundle difícil de ler.", `Use o REA em <APP.ASAR OU BUNDLE.JS> para seguir <RECURSO> pelo código minificado. Identifique módulos, recupere funções relevantes com nomes legíveis, acompanhe os dados do evento de UI ao efeito em rede/arquivo e produza um grafo de chamadas. Cite offsets do bundle em cada etapa.`, "Avançado"),
  p("recurso-web", "electron", "Mapear um recurso de um site", "Observa requisições, scripts e mudanças de estado enquanto você usa uma funcionalidade.", `Use o REA para observar <SITE> enquanto uso <RECURSO>. Liste requisições, scripts e mudanças de estado envolvidos e resuma como o recurso funciona e quais partes rodam no navegador e no servidor.`, "Comece por aqui"),
  p("reconstruir-site", "electron", "Reconstruir estrutura e comportamento de um site", "Mapeia rotas e chamadas para criar um equivalente funcional com identidade e recursos próprios.", `Use o REA para inspecionar <SITE>. Recupere a estrutura das páginas, rotas do cliente, chamadas de API de cada visão e gerenciamento de estado. Reconstrua um equivalente funcional com meus próprios recursos e estilos, mantendo o comportamento observado. Liste requisições e scripts como evidência por visão.`),
  p("mapa-antcheat", "protecao", "Mapear detecções de um anti-cheat em laboratório", "Estudo estático do que uma proteção monitora e envia, sem abrir o jogo.", `Use o REA para analisar <DRIVER OU SERVIÇO ANTI-CHEAT> em uma máquina de laboratório que possuo.

Identifique o que ele enumera, quais verificações de integridade faz, o que registra no kernel e quais dados envia. Cite função/endereço para cada descoberta e separe código presente de comportamento observado. Não execute o jogo; comece estaticamente.`, "Avançado"),
  p("testar-protecao", "protecao", "Testar as proteções do meu produto", "Revisão ofensiva autorizada do próprio software para descobrir o que precisa ser corrigido.", `Eu possuo <MEU APLICATIVO> e seu esquema de proteção. Use o REA para avaliá-lo como um atacante: localize verificação de licença, integridade e anti-debug/VM e siga o resultado de uma falha. Informe o que é trivialmente contornável, o que sustenta a proteção e correções concretas, sempre com evidências.`, "Avançado"),
  p("fluxo-licenca", "protecao", "Documentar licença para interoperabilidade", "Entende o fluxo de licenciamento do software que você possui sem remover ou burlar a verificação.", `Use o REA em <APLICATIVO> para documentar o fluxo de licenciamento: onde o direito de uso é validado, verificações locais e remotas, estado gravado e funcionamento offline. O objetivo é interoperabilidade e revisão de segurança de software que possuo legalmente. Relate fatos com evidências e sinalize o que não pôde ser confirmado.`, "Avançado"),
  p("dma-plataforma", "dma", "Como a plataforma limita acesso DMA", "Explica defesas contra leitura externa de memória e o que realmente sustenta cada proteção.", `Use o REA em <DRIVER ANTI-CHEAT OU FIRMWARE DE PROTEÇÃO DMA> no meu laboratório.

Explique, com evidências, como a plataforma restringe leituras externas PCIe (IOMMU, ACLs Thunderbolt e proteção do kernel), o que o anti-cheat enumera para detectar DMA e quais verificações são essenciais ou apenas cosméticas.`, "Avançado"),
  p("dma-amostra", "dma", "Documentar uma amostra de toolchain DMA", "Análise defensiva de uma amostra já obtida, sem executá-la contra jogos ou outras máquinas.", `Tenho uma amostra <FIRMWARE DMA, DRIVER PCILEECH OU LEITOR USER-MODE> para pesquisa defensiva. Use o REA para documentar como ela abre memória física, localiza o processo, lê/escreve dados e tenta evitar detecção. Forneça a cadeia de funções com endereços. Não execute contra nenhum jogo ativo — somente análise.`, "Avançado"),
  p("dma-lacunas", "dma", "Encontrar lacunas de defesa do meu produto", "Avalia como seu próprio software reagiria a acesso físico e propõe proteções práticas.", `Use o REA para avaliar como <MEU APLICATIVO OU ANTI-CHEAT> reagiria a acesso físico externo à memória: verificações de integridade, previsibilidade de valores sensíveis e validações do servidor. Proponha hardening mapeado aos locais do código que precisam de cada mudança.`, "Avançado"),
  p("fpga-firmware", "dma", "Estudar firmware de dispositivo FPGA ou MCU", "Mapeia um dispositivo próprio, seu protocolo com o computador e comportamento de enumeração.", `Use o REA em <DUMP DE FIRMWARE> de um dispositivo PCIe/USB que possuo. Identifique MCU/soft-core FPGA, protocolo com o host, primitivas de leitura de memória e comportamento de enumeração. Mostre evidências e marque o que precisa de confirmação em execução.`, "Avançado"),
  p("documentar-serial", "cracking", "Documentar validação de serial sem burlar", "Recupera o algoritmo para estudo e testes, sem modificar ou remover a verificação.", `Use o REA em <BINÁRIO> para encontrar a rotina que valida <CHAVE OU SERIAL>. Recupere o algoritmo, identifique codificação da entrada, checksum/transformações e ramos de sucesso/falha com endereços. Escreva testes com entradas de exemplo. Não aplique patch nem burle nada — quero o algoritmo documentado, não a verificação removida.`, "Avançado"),
  p("resolver-crackme", "cracking", "Resolver um crackme ou CTF", "Um roteiro para desafios criados especificamente para aprendizado.", `Use o REA neste crackme: <CAMINHO>. Enumere pontos de entrada, textos, importações e proteções. Identifique a lógica de verificação da flag, descompile-a e derive a entrada correta a partir do algoritmo recuperado. Mostre a cadeia completa: endereço → instrução → conclusão.`, "Avançado"),
  p("diff-protecao", "cracking", "Comparar proteções entre versões", "Explica o que mudou na camada de proteção e qual parece ser a intenção de cada mudança.", `Use o REA para comparar <APLICATIVO PROTEGIDO V1> e <V2>. Identifique mudanças na proteção: novas verificações de integridade, anti-debug e caminhos de validação. Relacione cada mudança a funções/endereços e explique a intenção de hardening.`, "Avançado"),
  p("comparar-versoes", "versoes", "Comparar duas versões de um aplicativo", "Separa mudanças reais de comportamento das diferenças normais de compilação.", `Use o fluxo compare_application_versions, se disponível, para comparar <VERSÃO ANTIGA> e <VERSÃO NOVA> de <APLICATIVO>.

Identifique mudanças funcionais, de API, dependências, permissões e possíveis correções de segurança.

Relacione cada mudança a funções ou arquivos e explique o impacto. Diferencie mudanças de build de mudanças de comportamento.`),
  p("continuar-investigacao", "longas", "Continuar de onde a investigação parou", "Revisa notas e escolhe o próximo passo que mais reduz incerteza.", `Revise as evidências e anotações desta investigação.

Use audit_residual_unknowns, se disponível, para listar o que ainda não foi demonstrado.

Priorize as próximas análises pelo quanto podem reduzir incerteza. Atualize INVESTIGATION.md com descobertas, evidências, hipóteses descartadas e próximos passos.`, "Comece por aqui"),
  p("prompt-curinga", "curinga", "Entender qualquer recurso com evidências", "O modelo mais versátil: preencha o recurso e o programa, cole no agente e peça uma especificação testável.", `Use o REA para entender como <RECURSO> funciona em <CAMINHO DO APLICATIVO>.

Verifique primeiro quais ferramentas estão realmente disponíveis. Comece pela análise estática e siga o recurso até as funções responsáveis.

Apresente evidências para cada conclusão, separe fatos de hipóteses e registre as limitações. Ao final, gere uma especificação comportamental e proponha testes para verificá-la.`, "Comece por aqui"),
];

export const getPrompt = (id: string) => reaPrompts.find((prompt) => prompt.id === id);
export const getPromptSection = (id: string) => promptSections.find((section) => section.id === id);
export const promptsForCategory = (category: string) => {
  const map: Record<string, string[]> = {
    "native-binaries": ["entender-executavel", "mergulho-funcao", "triagem-binario", "formato-arquivo", "extrair-protocolo"],
    android: ["auditar-apk", "android-nativo", "android-dados", "android-ofuscado"],
    "apple-apps": ["explicar-recurso", "seguir-botao", "clonar-interface"],
    electron: ["anatomia-electron", "seguranca-ipc", "javascript-minificado"],
    web: ["recurso-web", "reconstruir-site", "mapa-inicial"],
    games: ["logica-jogo", "dificuldade-jogo", "mapa-engine", "mod-offline"],
    firmware: ["triagem-firmware", "firmware-mcu", "firmware-rede"],
    "formats-protocols": ["formato-arquivo", "extrair-protocolo", "explicar-recurso"],
    wasm: ["wasm-mapa", "wasm-plano", "wasm-nucleo"],
    "feature-rebuilds": ["clone-completo", "clonar-recurso", "validar-clone", "clonar-interface"],
    interop: ["extrair-protocolo", "firmware-rede", "explicar-recurso"],
    "security-research": ["auditoria-fronteiras", "fonte-para-sink", "comparar-patch", "meus-dados"],
    "agent-workflows": ["prompt-curinga", "continuar-investigacao", "validar-clone"],
    integrations: ["instalar-rea", "mapa-inicial", "continuar-investigacao"],
    learning: ["mapa-inicial", "exportar-csv", "prompt-curinga"],
  };
  const ids = map[category] ?? ["prompt-curinga", "explicar-recurso", "recuperar-regra"];
  return ids.map((id) => getPrompt(id)).filter((prompt): prompt is ReaPrompt => Boolean(prompt));
};
