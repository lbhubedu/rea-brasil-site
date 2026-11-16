export type Tool = {
  slug: string;
  name: string;
  summary: string;
  targets: string;
  analysis: string;
  needs: string;
  cost: string;
  best: string;
  caution: string;
  install?: string;
  source: string;
};

export const tools: Tool[] = [
  { slug: "rea", name: "REA — Reverse Engineer Anything", summary: "Um único servidor MCP que conecta seu agente de programação a várias ferramentas de investigação e oferece orientação de fluxo.", targets: "Programas nativos, Android, apps Apple, JavaScript/Electron, sites, .NET, firmware, WASM e capturas de rede", analysis: "Estática e dinâmica, incluindo Frida, navegador e captura de processos", needs: "Muitos formatos funcionam sem extras; pseudocódigo nativo usa Hopper, Ghidra, IDA ou Kuna", cost: "MIT; motores pagos são opcionais", best: "Uma instalação para vários tipos de alvo, com evidências e limites em cada resultado", caution: "Pode exigir ferramentas externas por tipo de alvo; alguns recursos de execução são exclusivos do Linux", install: "npx rea-agents@latest setup", source: "https://github.com/morluto/rea" },
  { slug: "leanrea", name: "leanrea", summary: "Um pequeno arquivo de habilidade que orienta o agente a usar ferramentas comuns de terminal. Não utiliza servidor MCP.", targets: "Variedade semelhante ao REA, por ferramentas de linha de comando", analysis: "Estática e dinâmica pelo shell", needs: "Nenhum requisito próprio; usa o que já está instalado", cost: "MIT", best: "Reconhecimento leve quando o agente já tem terminal e ferramentas", caution: "Não cria evidências estruturadas ou sessões; o resultado depende das ferramentas e do modelo", install: "npx skills add aicodeking/leanrea", source: "https://github.com/aicodeking/leanrea" },
  { slug: "ghidra-mcp", name: "GhidraMCP", summary: "Plugin Ghidra com ponte MCP para descompilar, renomear e listar funções, importações e exportações.", targets: "Programas nativos", analysis: "Estática", needs: "Ghidra gratuito com a interface gráfica aberta", cost: "Apache-2.0", best: "A ponte Ghidra gratuita mais simples e conhecida", caution: "Conjunto enxuto de ferramentas; exige GUI e plugin ativos", source: "https://github.com/LaurieWired/GhidraMCP" },
  { slug: "ghidra-mcp-headless", name: "ghidra-mcp", summary: "Uma integração Ghidra ampla, com modos gráfico e headless e suporte a Docker.", targets: "Programas nativos", analysis: "Estática", needs: "Ghidra 12.1.4 e Java 21", cost: "Apache-2.0", best: "Trabalho profundo ou automatizado, inclusive sem interface", caution: "Ligado a uma versão exata; muitas ferramentas consomem mais contexto", source: "https://github.com/bethington/ghidra-mcp" },
  { slug: "reva", name: "ReVa", summary: "Extensão Ghidra com ferramentas pequenas e amigáveis a modelos, planejadas para sessões longas.", targets: "Programas nativos e firmware", analysis: "Estática", needs: "Ghidra com ou sem interface", cost: "Código aberto", best: "Sessões longas com binários grandes ou imagens completas", caution: "Somente Ghidra; projetos headless não permanecem entre sessões", source: "https://github.com/cyberkaida/reverse-engineering-assistant" },
  { slug: "ida-mcp", name: "IDA Pro MCP", summary: "Integração IDA Pro recomendada em modo headless, com ferramentas opcionais de depuração.", targets: "Programas nativos", analysis: "Estática e depuração opcional", needs: "IDA Pro 8.3 ou superior; IDA Free não é suportado", cost: "Integração MIT; IDA Pro é comercial", best: "Equipes que já possuem IDA Pro e seu descompilador", caution: "Exige licença comercial do IDA Pro", source: "https://github.com/mrexodia/ida-pro-mcp" },
  { slug: "binary-ninja-mcp", name: "Binary Ninja MCP", summary: "Plugin e ponte MCP instaláveis pelo gerenciador de plugins do Binary Ninja.", targets: "Programas nativos", analysis: "Estática", needs: "Binary Ninja com interface gráfica", cost: "GPL-3.0; Binary Ninja é pago", best: "Quem já trabalha no Binary Ninja", caution: "Exige licença e o ritmo de desenvolvimento diminuiu", source: "https://github.com/fosdickio/binary_ninja_mcp" },
  { slug: "binary-ninja-headless", name: "Binary Ninja Headless MCP", summary: "Integração somente headless com patch, desfazer e automação por scripts.", targets: "Programas nativos", analysis: "Estática e patch", needs: "Licença Binary Ninja com suporte headless", cost: "GPL-2.0; licença comercial", best: "Agentes em contêineres ou integração contínua", caution: "A licença headless tem custo mais alto", source: "https://github.com/mrphrazer/binary-ninja-headless-mcp" },
  { slug: "radare2-mcp", name: "radare2 MCP (r2mcp)", summary: "Servidor MCP construído sobre as APIs nativas do radare2, com modos somente leitura e sandbox.", targets: "Programas nativos", analysis: "Estática; conecta-se a sessões r2 ou iaito", needs: "radare2 gratuito", cost: "MIT", best: "Opção gratuita, leve e programável para código nativo", caution: "Saída de mais baixo nível que os descompiladores Ghidra ou IDA", install: "r2pm -Uci r2mcp", source: "https://github.com/radareorg/radare2-mcp" },
  { slug: "jadx-mcp", name: "JADX AI MCP", summary: "Plugin para a interface JADX com servidor MCP que expõe classes e métodos Android descompilados.", targets: "Android APK e DEX", analysis: "Estática", needs: "JADX GUI gratuito com o plugin", cost: "Apache-2.0", best: "Revisão estática de aplicativos Android", caution: "Projeto em estágio inicial e precisa do jadx-gui aberto", source: "https://github.com/zinja-coder/jadx-ai-mcp" },
  { slug: "x64dbg-mcp", name: "x64dbg MCP Server", summary: "Plugin nativo que permite ao agente operar o depurador x64dbg por MCP.", targets: "Processos Windows x86 e x64", analysis: "Dinâmica com depurador", needs: "x64dbg gratuito", cost: "MIT", best: "Depuração ao vivo de executáveis Windows", caution: "Somente Windows; depura em vez de descompilar", source: "https://github.com/duty1g/x64dbg-mcp-server" },
];

export type GuideBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  code?: string;
  quote?: string;
};

export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  readingTime: string;
  blocks: GuideBlock[];
};

export const guides: Guide[] = [
  {
    slug: "what-is-rea",
    eyebrow: "GUIA 01 • CONCEITOS",
    title: "O que é REA, sem palavras difíceis?",
    intro: "REA significa Reverse Engineer Anything — algo como “faça engenharia reversa de qualquer coisa”. Ele dá ao seu assistente de programação ferramentas para examinar um programa e responder com base no que encontrou, não em suposições.",
    readingTime: "4 min de leitura",
    blocks: [
      { heading: "O que ele consegue examinar", bullets: ["Programas de computador: funções, textos internos, referências e ligações entre chamadas.", "Apps JavaScript e Electron: módulos, rotas, canais de comunicação e dependências nativas.", "Atividade no navegador e em processos: o que muda durante o uso e como duas execuções diferem.", "APKs Android, firmware, .NET, formatos de arquivo e protocolos, conforme as ferramentas disponíveis."] },
      { heading: "Como é uma sessão", steps: ["Você escolhe um programa e pergunta sobre apenas um recurso.", "O agente usa o REA para ler código recuperado, referências e, quando autorizado, o comportamento durante a execução.", "Ele explica o que encontrou e mostra a evidência de cada conclusão.", "Se você quiser, ele cria uma versão pequena do comportamento para você testar."] },
      { quote: "Pense no REA como uma caixa de ferramentas de investigação. A IA continua precisando das suas perguntas, do seu contexto e da sua revisão." },
      { heading: "Antes de começar", paragraphs: ["O REA tem licença MIT e seu código é aberto. Examine apenas software próprio, aberto ou que você tenha autorização para analisar. Respeite licenças, privacidade e termos aplicáveis. O site oficial do projeto é rea.tools e o repositório oficial é github.com/morluto/rea."] },
    ],
  },
  {
    slug: "how-to-use-rea",
    eyebrow: "GUIA 02 • PASSO A PASSO",
    title: "Como usar o REA pela primeira vez",
    intro: "Instale no seu agente, faça uma pergunta pequena, confira as evidências e transforme a descoberta em algo que você possa testar.",
    readingTime: "6 min de leitura",
    blocks: [
      { heading: "1. Instale no seu agente", paragraphs: ["Abra o terminal do seu computador. Se você nunca usou um terminal, procure por “Terminal” no macOS/Linux ou “Windows PowerShell” no Windows. Cole o comando abaixo e pressione Enter. O instalador mostra um plano antes de modificar a configuração."], code: "npx rea-agents@latest setup", bullets: ["Aprove o plano somente depois de ler as mudanças.", "Reinicie o agente para carregar as novas ferramentas.", "O guia oficial cobre Windows, macOS, Linux e alternativas de instalação."] },
      { heading: "2. Pergunte sobre um único recurso", paragraphs: ["Perguntas estreitas produzem respostas melhores. Diga qual é o programa, qual recurso você quer entender e o que espera receber. Por exemplo: “No meu app de notas, explique como o botão Exportar cria o CSV e mostre as evidências.”"] },
      { heading: "3. Deixe investigar e revise", bullets: ["Peça o código ou a observação que sustenta cada afirmação.", "Solicite uma versão mínima da regra que você possa executar.", "Mude uma entrada e confirme se a reconstrução se comporta como o original.", "Exija uma lista do que não foi confirmado."] },
      { heading: "4. Compartilhe o aprendizado", paragraphs: ["Escreva o que você investigou, quais ferramentas usou e como validou o resultado. Publique o repositório, artigo ou vídeo e envie o link para a curadoria da Rea Brasil LB. Um experimento que não funcionou também pode ensinar."] },
    ],
  },
  {
    slug: "writing-investigation-prompts",
    eyebrow: "GUIA 03 • PROMPTS",
    title: "Como escrever prompts que produzem boas investigações",
    intro: "Um bom prompt não precisa ser longo nem cheio de termos técnicos. Ele precisa deixar claro o alvo, a pergunta, a evidência esperada e o resultado final.",
    readingTime: "7 min de leitura",
    blocks: [
      { heading: "As seis regras que mais ajudam", steps: ["Um recurso por prompt. “Explique o app inteiro” gera respostas rasas; “siga o botão Exportar” gera um caminho verificável.", "Exija evidências. Peça arquivo, função, endereço, requisição ou observação para cada afirmação.", "Separe fato, inferência e desconhecido. Isso impede que uma hipótese pareça certeza.", "Comece pela análise estática. Diga “não execute o aplicativo” até que a observação em execução seja necessária e autorizada.", "Termine com uma entrega: SPEC.md, um leitor, um teste ou uma pequena reconstrução.", "Declare o escopo: “meu dispositivo”, “meu software”, “CTF” ou “ambiente offline”."] },
      { heading: "Exemplo fraco e exemplo forte", paragraphs: ["Fraco: “Veja esse app e copie o login.”", "Forte: “No meu aplicativo Android em /projetos/minha-conta, siga o botão Entrar até a requisição de autenticação. Não execute o app. Liste classes e métodos, campos enviados e validações. Separe fatos de hipóteses e entregue um diagrama do fluxo.”"] },
      { heading: "O checklist de 20 segundos", bullets: ["Eu disse qual programa analisar?", "Eu escolhi apenas um recurso?", "Eu informei o que não deve ser executado ou alterado?", "Eu pedi evidências e incertezas?", "Eu descrevi o arquivo, teste ou explicação que quero receber?", "Eu confirmei que tenho autorização?"] },
    ],
  },
  {
    slug: "reverse-engineer-an-android-app",
    eyebrow: "GUIA 04 • ANDROID",
    title: "Olhe dentro de um app Android com seu agente",
    intro: "Um APK funciona como um pacote ZIP com código, manifesto e recursos. Por isso Android é um bom ponto de partida: muita coisa pode ser lida antes de executar o aplicativo.",
    readingTime: "9 min de leitura",
    blocks: [
      { heading: "Antes de começar", bullets: ["Escolha um app aberto, próprio ou associado a um dispositivo que você possua. Não use o processo para contornar pagamentos, licenças ou limites de conta.", "Prefira um aparelho de teste ou emulador e uma conta de teste.", "Peça ao agente para manter notas em um arquivo, permitindo continuar depois."] },
      { heading: "Como obter o APK", paragraphs: ["Apps abertos costumam estar no F-Droid ou GitHub. Para um app já instalado no seu aparelho, ative a depuração USB e use adb. Apps da Play Store podem estar divididos em vários APKs; nesse caso, obtenha todos."], code: "adb shell pm list packages | grep <nome>\nadb shell pm path <pacote>\nadb pull <caminho informado> base.apk" },
      { heading: "O caminho da investigação", steps: ["Leia o manifesto: ele lista telas, serviços, permissões e links profundos.", "Escolha um recurso e encontre seu início: texto de botão, deep link ou chamada de rede.", "Siga o código. Se houver nomes como a.b.c, comece por textos, URLs e chamadas Android que conservam nomes.", "Quando autorizado, compare o código com a rede observada durante o uso.", "Registre separadamente o que foi confirmado e o que foi deduzido.", "Construa a menor prova possível: um comando adb, uma requisição ou uma tela."] },
      { code: "Use o REA no APK <APP>. Descubra como <RECURSO> funciona: activities, serviços e chamadas de rede envolvidos. Mostre o código descompilado de cada etapa e liste o que não pôde ser confirmado.", quote: "Apps Cordova e Ionic guardam boa parte da lógica em assets/www. React Native usa um bundle JavaScript. Aponte o agente para esses arquivos antes de ler todo o código Java." },
    ],
  },
  {
    slug: "reverse-engineer-a-device-protocol",
    eyebrow: "GUIA 05 • DISPOSITIVOS",
    title: "Faça seu dispositivo funcionar sem depender do app do fabricante",
    intro: "Teclados, leitores RFID e TVs podem ter clientes exclusivos para um sistema. A interoperabilidade permite estudar como o app conversa com seu próprio aparelho e criar um cliente adequado ao seu computador.",
    readingTime: "8 min de leitura",
    blocks: [
      { heading: "Preparação segura", bullets: ["Trabalhe em um dispositivo próprio ou com autorização explícita.", "Mantenha o app original instalado para comparar resultados.", "Comece com comandos de leitura, como status e versão.", "Evite atualizações de firmware e gravações de configuração até entender o protocolo: uma gravação errada pode inutilizar o aparelho."] },
      { heading: "Seis etapas", steps: ["Encontre o código que fala com o dispositivo: uma DLL, JavaScript Electron ou classes de rede Android.", "Identifique o transporte: USB HID, porta serial, Bluetooth ou serviço de rede descoberto por mDNS.", "Decodifique um único comando de ponta a ponta, como mudar uma cor ou ler status.", "Crie uma tabela de mensagens com bytes e origem de cada conclusão.", "Escreva a menor ferramenta capaz de enviar esse comando e teste no aparelho real.", "Publique as notas do protocolo junto do código para que outras pessoas possam revisar."] },
      { code: "Use o REA em <APP OU DLL DO FABRICANTE>, que controla meu <DISPOSITIVO>. Encontre o código que envia comandos e o transporte usado (USB HID, serial ou rede). Documente os bytes de <RECURSO> e escreva uma ferramenta mínima em <LINGUAGEM> que envie o mesmo comando. Marque o que foi observado e o que foi inferido." },
    ],
  },
  {
    slug: "is-claude-blocking-reverse-engineering",
    eyebrow: "GUIA 06 • CONTEXTO",
    title: "O Claude está bloqueando engenharia reversa?",
    intro: "Relatos descrevem respostas interrompidas ou mais fracas em temas de segurança. O ponto importante é entender as salvaguardas do provedor e formular um escopo legítimo, sem contornar proteções.",
    readingTime: "6 min de leitura",
    blocks: [
      { heading: "O que pode acontecer", paragraphs: ["Provedores de IA aplicam verificações de segurança ao pedido e ao material lido durante a conversa. Conteúdo sobre exploração, malware ou invasão pode interromper uma resposta. Algumas configurações também podem trocar o modelo em determinadas tarefas; avisos e políticas do provedor devem ser consultados para informações atuais."] },
      { heading: "O que continua sendo um bom caso de uso", bullets: ["Estudar o comportamento de um recurso e reconstruí-lo de forma independente.", "Entender formatos e protocolos de dispositivos próprios.", "Revisar e corrigir seu código, seus binários e seus apps.", "Documentar fatos, evidências e limitações em pesquisa autorizada."] },
      { heading: "Se o trabalho for interrompido", steps: ["Explique o que você tem autorização para analisar e por quê: “meu dispositivo”, “software mantido pela minha equipe” ou “revisão defensiva”.", "Verifique avisos do provedor sobre troca de modelo ou interrupção.", "Para trabalho profissional de segurança, consulte os programas oficiais de verificação do provedor.", "Lembre-se de que REA não depende de um único agente: há suporte a Codex, Gemini CLI, Cursor e outros hosts compatíveis com MCP."] },
      { paragraphs: ["Fontes de referência: Anthropic Cyber Verification Program, central de ajuda do Claude e repositório oficial do REA. Políticas mudam; consulte as páginas oficiais antes de tirar conclusões."] },
    ],
  },
];

export const glossary = [
  { term: "Agente de IA", definition: "Um assistente capaz de usar ferramentas e executar uma sequência de ações, como Claude Code, Codex ou Cursor." },
  { term: "Engenharia reversa", definition: "Investigar como algo funciona a partir do programa, dos arquivos ou do comportamento observável." },
  { term: "Código-fonte", definition: "O texto original escrito pelos desenvolvedores. Nem sempre está disponível para quem usa o programa." },
  { term: "Binário / executável", definition: "O arquivo pronto que o computador executa, como um .exe no Windows." },
  { term: "APK", definition: "O pacote de instalação de um aplicativo Android. Reúne código, manifesto e recursos." },
  { term: "Análise estática", definition: "Leitura dos arquivos sem executar o programa. É o ponto de partida mais controlado." },
  { term: "Análise dinâmica", definition: "Observação do programa durante a execução, em ambiente autorizado e preparado." },
  { term: "Descompilação", definition: "Uma aproximação legível do código produzida a partir do executável. Não é o código-fonte original." },
  { term: "MCP", definition: "Model Context Protocol: um padrão para conectar agentes de IA a ferramentas externas." },
  { term: "Evidência", definition: "O arquivo, função, endereço, requisição ou observação que permite conferir uma afirmação." },
  { term: "Inferência", definition: "Uma conclusão provável que ainda precisa de confirmação. Deve ficar separada dos fatos." },
  { term: "Sala limpa", definition: "Método em que se documenta o comportamento e outra implementação é criada sem copiar código ou ativos." },
];
