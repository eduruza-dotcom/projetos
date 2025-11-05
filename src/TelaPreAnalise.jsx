import React, { useEffect, useMemo, useRef, useState } from "react";

const ITENS_EXEMPLO = [
  { id: 1, dataReceb: "25/09/2025", recebidoPor: "EDUARDO", lpn: "A1234567", sku: "5313546", modeloRef: "TV 50 LG 4K UHD 50UT8050PSA WIFI BT HDMI", ean: "7893299951862", nf: "000123" },
  { id: 2, dataReceb: "26/09/2025", recebidoPor: "FERNANDA", lpn: "B7654321", sku: "5331250", modeloRef: "TV 32 PHILCO PTV32M9GACGB LED HDMI USB WIFI", ean: "7891356122613", nf: "000456" },
  { id: 3, dataReceb: "26/09/2025", recebidoPor: "ADRIANO", lpn: "C0000001", sku: "5342279", modeloRef: "TV 65 HISENSE UHD 4K DLED 65A6N 65A51HUV 1000", ean: "7908842834391", nf: "000789" },
  { id: 4, dataReceb: "27/09/2025", recebidoPor: "CARLOS", lpn: "D2222222", sku: "5277914", modeloRef: "TV 55 QNED 4K LG 55QNED80SRA", ean: "7893299928895", nf: "000321" },
  { id: 5, dataReceb: "28/09/2025", recebidoPor: "MARIANA", lpn: "E3333333", sku: "5313546", modeloRef: "TV 50 LG 4K UHD 50UT8050PSA WIFI BT HDMI", ean: "7893299951862", nf: "000654" },
  { id: 6, dataReceb: "29/09/2025", recebidoPor: "RAFAEL", lpn: "F4444444", sku: "5327946", modeloRef: "TV 50 PHILCO UHD 4K LED PTV50VA4REGB HDMI USB WIFI", ean: "7891356121784", nf: "000987" },
];

const CATALOGOS = {
  LG: ["50UT8050PSA", "50UT8050PSA.BWZJLJZ", "50UT8050PSA.AWZJLJZ", "55QNED80SRA", "55QNED80SRA.AWZFLSZ", "55QNED80SRA.AWZYLSZ"],
  HISENSE: ["65A6N", "T65A6N"],
  PHILCO: [
    "PTV32M9GACGB",
    "PTV32M9GACGB V.A",
    "PTV32M9GACGB V.B",
    "PTV32M9GACGB V.C",
    "PTV32M9GACGB V.D",
    "PTV50VA4REGB",
    "PTV50VA4REGB V.A",
    "PTV50VA4REGB V.B",
    "PTV43VA4REGB",
    "PTV43VA4REGB V.A",
    "PTV43VA4REGB V.B",
  ],
};

const EAN_PARA_MODELOS = {
  "7893299951862": { fabricante: "LG", modelos: ["50UT8050PSA", "50UT8050PSA.BWZJLJZ", "50UT8050PSA.AWZJLJZ"] },
  "7891356122613": { fabricante: "PHILCO", modelos: ["PTV32M9GACGB", "PTV32M9GACGB V.A", "PTV32M9GACGB V.B", "PTV32M9GACGB V.C", "PTV32M9GACGB V.D"] },
  "7908842834391": { fabricante: "HISENSE", modelos: ["65A6N", "T65A6N"] },
  "7893299928895": { fabricante: "LG", modelos: ["55QNED80SRA", "55QNED80SRA.AWZFLSZ", "55QNED80SRA.AWZYLSZ"] },
  "7891356121784": { fabricante: "PHILCO", modelos: ["PTV50VA4REGB", "PTV50VA4REGB V.A", "PTV50VA4REGB V.B"] },
};

const norm = (s) => String(s || "").trim().toUpperCase();

const baseModelo = (m) => {
  let u = norm(m);
  u = u.replace(/\s+V\.[A-Z0-9]+$/, "");
  u = u.replace(/\.[A-Z0-9]+$/, "");
  return u;
};

const ACESSORIOS_BASE = {
  "50UT8050PSA": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA", "MANUAL"],
  "55QNED80SRA": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA", "MANUAL"],
  "65A6N": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA"],
  "T65A6N": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA"],
  "PTV32M9GACGB": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA", "MANUAL"],
  "PTV50VA4REGB": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA", "MANUAL"],
  "PTV43VA4REGB": ["CONTROLE REMOTO", "BASE/PEDESTAL", "PARAFUSOS DA BASE", "CABO DE FORÇA", "MANUAL"],
};

const STATUS_ACESSORIO = {
  "CONTROLE REMOTO": ["OK", "FALTANTE", "RISCADO", "DANIFICADO"],
  "BASE/PEDESTAL": ["OK", "FALTANTE", "RISCADO", "DANIFICADO"],
  "PARAFUSOS DA BASE": ["OK", "FALTANTE"],
  "CABO DE FORÇA": ["OK", "FALTANTE", "DANIFICADO"],
  MANUAL: ["OK", "FALTANTE", "DANIFICADO"],
};

const PECAS_BASE = {
  "50UT8050PSA": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "55QNED80SRA": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "65A6N": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "T65A6N": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "PTV32M9GACGB": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "PTV50VA4REGB": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  "PTV43VA4REGB": ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
};

const PECAS_ESTATICAS_POR_FAB = {
  LG: ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  HISENSE: ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
  PHILCO: ["TELA", "GABINETE FRONTAL", "TAMPA TRASEIRA"],
};

const STATUS_ESTATICA = ["OK", "RISCADO", "DANIFICADO"];

const FUNC_BASE = {
  "50UT8050PSA": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
  "55QNED80SRA": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
  "65A6N": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "USB", "SINTONIZADOR"],
  "T65A6N": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "USB", "SINTONIZADOR"],
  "PTV32M9GACGB": ["TELA", "ÁUDIO", "HDMI", "USB", "SINTONIZADOR"],
  "PTV50VA4REGB": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "USB", "SINTONIZADOR"],
  "PTV43VA4REGB": ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
};

const FUNC_POR_FAB = {
  LG: ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
  HISENSE: ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
  PHILCO: ["TELA", "ÁUDIO", "HDMI", "WI-FI", "BLUETOOTH", "USB", "SINTONIZADOR"],
};

const DEFEITOS_POR_FUNC = {
  "ÁUDIO": ["SEM ÁUDIO", "BAIXO/DISTORCIDO", "ESTALOS/CHIADOS", "APENAS EM UM LADO", "ATRASO/LIP-SYNC"],
  HDMI: ["SEM SINAL", "INTERMITENTE", "SEM ÁUDIO VIA HDMI", "NÃO RECONHECE DISPOSITIVO", "HDR NÃO ATIVA", "HDCP FALHA", "CEC NÃO FUNCIONA"],
  "WI-FI": ["NÃO CONECTA", "QUEDA DE CONEXÃO", "SINAL FRACO", "SEM INTERNET", "NÃO ENCONTRA REDES"],
  BLUETOOTH: ["NÃO PAREIA", "DESCONECTA", "ÁUDIO CORTANDO", "RUÍDO/INTERFERÊNCIA"],
  USB: ["NÃO LÊ USB", "LÊ ALGUNS DISPOSITIVOS", "PORTA DANIFICADA", "NÃO ALIMENTA ENERGIA"],
  SINTONIZADOR: ["SEM SINAL", "NÃO SALVA CANAIS", "IMAGEM COM CHUVA", "SEM ÁUDIO EM CANAIS"],
  TELA: ["SEM IMAGEM", "LINHAS NA TELA", "MANCHAS/VAZAMENTO", "PIXEL QUEIMADO", "BACKLIGHT FRACO"],
};

const EMBALAGENS_POR_EAN = {
  "7893299951862": ["EMBALAGEM", "FUNDO", "CALÇO SUPERIOR", "CALÇO INFERIOR"],
  "7891356122613": ["EMBALAGEM", "FUNDO", "CALÇO SUPERIOR", "CALÇO INFERIOR"],
  "7908842834391": ["EMBALAGEM", "FUNDO", "CALÇO SUPERIOR", "CALÇO INFERIOR"],
  "7893299928895": ["EMBALAGEM", "FUNDO", "CALÇO SUPERIOR", "CALÇO INFERIOR"],
  "7891356121784": ["EMBALAGEM", "FUNDO", "CALÇO SUPERIOR", "CALÇO INFERIOR"],
};

const STATUS_EMB = ["OK", "AMASSADO", "DANIFICADO", "FALTANTE"];

const parseBRDate = (d) => {
  const [dd, mm, yyyy] = String(d).split("/").map(Number);
  return new Date(yyyy, (mm || 1) - 1, dd || 1);
};
const aplicarPoliticaMaisAntigo = (itens) =>
  [...itens]
    .sort(
      (a, b) =>
        parseBRDate(a.dataReceb) - parseBRDate(b.dataReceb) || a.id - b.id,
    )
    .map((item, idx) => ({ ...item, habilitado: idx === 0 }));

const MODEL_TO_FAB = new Map(
  Object.entries(CATALOGOS).flatMap(([fab, arr]) =>
    arr.map((modelo) => [norm(modelo), fab]),
  ),
);

const MODELOS_CHAVE = new Set(
  []
    .concat(Object.keys(ACESSORIOS_BASE), ...Object.values(CATALOGOS))
    .map(norm),
);

const extrairCodigoModelo = (texto = "") => {
  const ref = norm(texto);
  for (const chave of MODELOS_CHAVE) {
    if (ref.includes(chave)) return chave;
  }
  const tokens = ref.split(/[^A-Z0-9\.]+/g).filter(Boolean);
  const candidato = tokens.reverse().find((token) => token.length >= 6);
  return candidato ? baseModelo(candidato) : "";
};

const obterFabricantePorModeloCodigo = (codigo) =>
  MODEL_TO_FAB.get(norm(codigo)) || MODEL_TO_FAB.get(baseModelo(codigo)) || "";

const obterAcessorios = (modelo) =>
  ACESSORIOS_BASE[baseModelo(modelo)] || [
    "CONTROLE REMOTO",
    "BASE/PEDESTAL",
    "PARAFUSOS DA BASE",
    "CABO DE FORÇA",
  ];

const obterPecasEsteticas = ({ modeloCodigo, fabricante }) =>
  PECAS_BASE[baseModelo(modeloCodigo)] ||
  PECAS_ESTATICAS_POR_FAB[fabricante] || [
    "TELA",
    "GABINETE FRONTAL",
    "TAMPA TRASEIRA",
  ];

const obterFuncionalidades = ({ modeloCodigo, fabricante }) =>
  FUNC_BASE[baseModelo(modeloCodigo)] ||
  FUNC_POR_FAB[fabricante] || [
    "TELA",
    "ÁUDIO",
    "HDMI",
    "WI-FI",
    "BLUETOOTH",
    "USB",
    "SINTONIZADOR",
  ];

const obterDefeitosPorFunc = (nome) =>
  DEFEITOS_POR_FUNC[norm(nome)] || [
    "NÃO LIGA",
    "SEM IMAGEM",
    "SEM ÁUDIO",
    "DESLIGA SOZINHA",
    "SEM SINAL",
    "LINHAS NA TELA",
  ];

const tudoOk = (lista) =>
  (lista || []).length > 0 && (lista || []).every((item) => item.status === "OK");

const temNaoOk = (lista) =>
  (lista || []).some((item) => item.status !== "OK");

const decidirDestino = ({
  acessorios,
  pecas,
  embalagens,
  temDefeito,
  aguardandoCadastroModelo,
  consideraEmb,
}) => {
  if (aguardandoCadastroModelo) return "CADASTRO DE MODELO/FABRICANTE";
  if (temDefeito === "SIM") return "ANÁLISE TÉCNICA";
  const temAcessorioNaoOk = temNaoOk(acessorios);
  const temPecaNaoOk = temNaoOk(pecas);
  const temEmbalagemNaoOk = consideraEmb && temNaoOk(embalagens);
  if (temAcessorioNaoOk || temPecaNaoOk || temEmbalagemNaoOk)
    return "EFETUAR ORÇAMENTO";
  if (
    tudoOk(acessorios) &&
    tudoOk(pecas) &&
    (!consideraEmb || tudoOk(embalagens)) &&
    temDefeito === "NAO"
  )
    return "CONTROLE DE QUALIDADE";
  return "EFETUAR ORÇAMENTO";
};

const precisaFoto = (status) =>
  ["RISCADO", "DANIFICADO", "AMASSADO"].includes(status);

const Th = ({ children }) => (
  <th className="px-3 py-2 font-semibold tracking-wide text-left border-b border-blue-200 sticky top-0 z-10 bg-[#d3e3ff] text-slate-800">
    {children}
  </th>
);

const Td = ({ children, mono = false }) => (
  <td
    className={`px-3 py-2 border-b border-blue-50 ${
      mono ? "font-mono text-slate-800" : "text-slate-700"
    }`}
  >
    {children}
  </td>
);

const Chip = ({ label, mono = false }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] ${
      mono ? "font-mono" : ""
    } bg-[#e7eeff] text-blue-700 border border-[#c8d8ff]`}
  >
    {label}
  </span>
);

const FotoPreview = ({ preview, onClear, onOpen }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onOpen}
      className="px-2 py-1 text-xs text-blue-700 border border-blue-200 rounded hover:bg-blue-50"
    >
      VER
    </button>
    <button
      type="button"
      onClick={onClear}
      className="px-2 py-1 text-xs text-red-700 border border-red-200 rounded hover:bg-red-50"
    >
      REMOVER
    </button>
  </div>
);
export default function TelaPreAnalise() {
  const USUARIO_ATUAL =
    typeof window !== "undefined"
      ? localStorage.getItem("usuario_nome") || "OPERADOR"
      : "OPERADOR";
  const TOTAL_ETAPAS = 6;
  const STEP_LABELS = [
    "FOTO Nº SÉRIE",
    "EMBALAGEM",
    "ACESSÓRIOS",
    "MODELO FAB.",
    "ESTÉTICA",
    "FUNCIONAL",
  ];

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [itensRaw, setItensRaw] = useState(ITENS_EXEMPLO);
  const itens = useMemo(() => aplicarPoliticaMaisAntigo(itensRaw), [itensRaw]);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [avaliados, setAvaliados] = useState([]);

  const [fotoSerie, setFotoSerie] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [semNumeroSerie, setSemNumeroSerie] = useState(false);
  const [numeroSerie, setNumeroSerie] = useState("");
  const [zoomImagem, setZoomImagem] = useState("");
  const fileInputRef = useRef(null);

  const [acessorios, setAcessorios] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState("");
  const [listaModelos, setListaModelos] = useState([]);
  const [aguardandoCadastroModelo, setAguardandoCadastroModelo] = useState(false);
  const [erroModelo, setErroModelo] = useState("");
  const [pecas, setPecas] = useState([]);
  const [funcionalidades, setFuncionalidades] = useState([]);

  const temFuncionalDefeito = useMemo(
    () => funcionalidades.some((f) => f.status === "NÃO OK"),
    [funcionalidades],
  );
  const faltamDefinirDefeitos = useMemo(
    () => funcionalidades.some((f) => f.status === "NÃO OK" && !f.defeito),
    [funcionalidades],
  );

  const [liga, setLiga] = useState("LIGA");

  const temConflito = useMemo(() => {
    if (liga !== "LIGA") return false;
    const tela = funcionalidades.find(
      (f) => norm(f.nome) === "TELA" && f.status === "NÃO OK",
    );
    const hdmi = funcionalidades.find(
      (f) => norm(f.nome) === "HDMI" && f.status === "NÃO OK",
    );
    const sint = funcionalidades.find(
      (f) => norm(f.nome) === "SINTONIZADOR" && f.status === "NÃO OK",
    );
    return Boolean(tela && (hdmi || sint));
  }, [funcionalidades, liga]);

  const resumoFunc = useMemo(
    () =>
      funcionalidades
        .filter((f) => f.status === "NÃO OK")
        .map((f) => `${f.nome}: ${f.defeito || "—"}`),
    [funcionalidades],
  );

  const [prioridadeConflito, setPrioridadeConflito] = useState("");

  const telaSemImagem = useMemo(() => {
    const tela = funcionalidades.find((f) => norm(f.nome) === "TELA");
    return Boolean(
      tela && tela.status === "NÃO OK" && tela.defeito === "SEM IMAGEM",
    );
  }, [funcionalidades]);

  const [historico, setHistorico] = useState([]);
  const [erroAcessorios, setErroAcessorios] = useState("");
  const [erroPecas, setErroPecas] = useState("");
  const [fotosAcessorios, setFotosAcessorios] = useState({});
  const [fotosPecas, setFotosPecas] = useState({});
  const [temEmbalagem, setTemEmbalagem] = useState("SIM");
  const [embalagens, setEmbalagens] = useState([]);
  const [fotosEmb, setFotosEmb] = useState({});
  const [erroEmb, setErroEmb] = useState("");

  const progresso = (etapaAtual / TOTAL_ETAPAS) * 100;
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const captureProp = isMobile ? { capture: "environment" } : {};

  const iniciarPreAnalise = (row) => {
    if (!row?.habilitado) return;

    setProdutoSelecionado(row);
    setEtapaAtual(1);
    setFotoSerie(null);
    setFotoPreview("");
    setSemNumeroSerie(false);
    setNumeroSerie("");
    setZoomImagem("");
    setLiga("LIGA");
    setPrioridadeConflito("");

    let codigo = "";
    if (row?.ean && EAN_PARA_MODELOS[row.ean]) {
      const { modelos } = EAN_PARA_MODELOS[row.ean];
      codigo = baseModelo(modelos[0] || "");
    } else {
      codigo = extrairCodigoModelo(row.modeloRef);
    }

    const baseAcessorios = obterAcessorios(codigo);
    setAcessorios(baseAcessorios.map((nome) => ({ nome, status: "OK" })));

    const embItems = (
      EMBALAGENS_POR_EAN[row.ean] || [
        "EMBALAGEM",
        "FUNDO",
        "CALÇO SUPERIOR",
        "CALÇO INFERIOR",
      ]
    ).map((nome) => ({ nome, status: "OK" }));
    setEmbalagens(embItems);
    setTemEmbalagem("SIM");

    setModeloSelecionado("");
    setFabricanteSelecionado("");
    setListaModelos([]);
    setAguardandoCadastroModelo(false);
    setErroModelo("");
    setPecas([]);
    setFuncionalidades([]);

    setHistorico([]);
    setErroAcessorios("");
    setErroPecas("");
    setErroEmb("");
    setFotosAcessorios({});
    setFotosPecas({});
    setFotosEmb({});

    setModalAberto(true);
  };
  const confirmarFoto = () => {
    if (!semNumeroSerie && numeroSerie.trim() === "") return;

    setHistorico((prev) => [
      ...prev,
      semNumeroSerie
        ? "ETAPA 1: SEM Nº SÉRIE"
        : `ETAPA 1: Nº SÉRIE ${numeroSerie}`,
    ]);
    setEtapaAtual(2);
  };

  const confirmarEmbalagem = () => {
    if (temEmbalagem === "NAO") {
      setEmbalagens((prev) => prev.map((e) => ({ ...e, status: "FALTANTE" })));
      setHistorico((prev) => [
        ...prev,
        "ETAPA 2: EMBALAGEM NÃO; ITENS FALTANTES",
      ]);
      setEtapaAtual(3);
      return;
    }

    if (temEmbalagem === "SIM") {
      const faltam = embalagens
        .map((e, i) => ({ e, i }))
        .filter(({ e, i }) => precisaFoto(e.status) && !fotosEmb[i]);

      if (faltam.length) {
        setErroEmb(
          `FOTO obrigatória para: ${faltam
            .map(({ e }) => e.nome)
            .join(", ")}`,
        );
        return;
      }

      setErroEmb("");
      const naoOk = embalagens.filter((e) => e.status !== "OK");
      setHistorico((prev) => [
        ...prev,
        `ETAPA 2: EMBALAGEM SIM; NÃO OK: ${
          naoOk.length ? naoOk.map((x) => x.nome).join(", ") : "nenhum"
        }`,
      ]);
      setEtapaAtual(3);
    }
  };

  const confirmarAcessorios = () => {
    const faltam = acessorios
      .map((a, i) => ({ a, i }))
      .filter(({ a, i }) => precisaFoto(a.status) && !fotosAcessorios[i]);

    if (faltam.length) {
      setErroAcessorios(
        `FOTO obrigatória para: ${faltam.map(({ a }) => a.nome).join(", ")}`,
      );
      return;
    }

    setErroAcessorios("");

    if (produtoSelecionado?.ean && EAN_PARA_MODELOS[produtoSelecionado.ean]) {
      const { fabricante, modelos } = EAN_PARA_MODELOS[produtoSelecionado.ean];
      setFabricanteSelecionado(fabricante);
      setListaModelos(modelos);
      setModeloSelecionado("");
      setErroModelo("");
      const naoOk = acessorios.filter((a) => a.status !== "OK");
      setHistorico((prev) => [
        ...prev,
        `ETAPA 3: ACESSÓRIOS ${acessorios.length}; NÃO OK: ${
          naoOk.length ? naoOk.map((x) => x.nome).join(", ") : "nenhum"
        }`,
      ]);
      setEtapaAtual(4);
      return;
    }

    const ref = norm(produtoSelecionado?.modeloRef || "");
    let fabSug = "";
    for (const fab of Object.keys(CATALOGOS)) {
      if (ref.includes(fab)) {
        fabSug = fab;
        break;
      }
    }
    if (!fabSug) {
      for (const [fab, lista] of Object.entries(CATALOGOS)) {
        if (lista.some((m) => ref.includes(norm(m)))) {
          fabSug = fab;
          break;
        }
      }
    }

    const modelos = fabSug ? CATALOGOS[fabSug] : Object.values(CATALOGOS).flat();
    setFabricanteSelecionado(fabSug || "");
    setListaModelos(modelos);
    setModeloSelecionado("");
    setErroModelo("");
    const naoOk = acessorios.filter((a) => a.status !== "OK");
    setHistorico((prev) => [
      ...prev,
      `ETAPA 3: ACESSÓRIOS ${acessorios.length}; NÃO OK: ${
        naoOk.length ? naoOk.map((x) => x.nome).join(", ") : "nenhum"
      }`,
    ]);
    setEtapaAtual(4);
  };

  const confirmarModelo = () => {
    if (!aguardandoCadastroModelo && !modeloSelecionado) {
      setErroModelo("SELECIONE UM MODELO OU SOLICITE CADASTRO.");
      return;
    }

    setErroModelo("");

    if (aguardandoCadastroModelo) {
      setPecas([]);
      setFuncionalidades([]);
      setHistorico((prev) => [
        ...prev,
        "ETAPA 4: SOLICITADO CADASTRO DE MODELO/FABRICANTE",
      ]);
      setEtapaAtual(6);
      return;
    }

    const fabricante =
      fabricanteSelecionado || obterFabricantePorModeloCodigo(modeloSelecionado);
    const listaPecas = obterPecasEsteticas({
      modeloCodigo: modeloSelecionado,
      fabricante,
    });
    setPecas(listaPecas.map((nome) => ({ nome, status: "OK" })));

    const funcs = obterFuncionalidades({
      modeloCodigo: modeloSelecionado,
      fabricante,
    });
    const ordered = ["TELA", ...funcs.filter((nome) => norm(nome) !== "TELA")];
    setFuncionalidades(
      ordered.map((nome) => ({ nome, status: "OK", defeito: "" })),
    );
    setFabricanteSelecionado(fabricante);
    setLiga("LIGA");
    setPrioridadeConflito("");
    setHistorico((prev) => [
      ...prev,
      `ETAPA 4: ${fabricante} ${modeloSelecionado}`.trim(),
    ]);
    setEtapaAtual(5);
  };

  const confirmarPecas = () => {
    const faltam = pecas
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => precisaFoto(p.status) && !fotosPecas[i]);

    if (faltam.length) {
      setErroPecas(
        `FOTO obrigatória para: ${faltam.map(({ p }) => p.nome).join(", ")}`,
      );
      return;
    }

    setErroPecas("");
    const naoOk = pecas.filter((p) => p.status !== "OK");
    setHistorico((prev) => [
      ...prev,
      `ETAPA 5: PEÇAS ${pecas.length}; NÃO OK: ${
        naoOk.length ? naoOk.map((x) => x.nome).join(", ") : "nenhuma"
      }`,
    ]);
    setEtapaAtual(6);
  };

  const finalizar = () => {
    const computedTemDef =
      liga === "NÃO LIGA" || funcionalidades.some((f) => f.status === "NÃO OK");

    const destino = decidirDestino({
      acessorios,
      pecas,
      embalagens,
      temDefeito: computedTemDef ? "SIM" : "NAO",
      aguardandoCadastroModelo,
      consideraEmb: temEmbalagem === "SIM",
    });

    const data = new Date().toLocaleDateString("pt-BR");

    setAvaliados((prev) => [
      ...prev,
      {
        data,
        preAnalista: USUARIO_ATUAL,
        lpn: produtoSelecionado?.lpn,
        sku: produtoSelecionado?.sku,
        numeroSerie: semNumeroSerie ? "SEM Nº SÉRIE" : numeroSerie || "",
        modeloRef: produtoSelecionado?.modeloRef,
        modeloFab: (
          fabricanteSelecionado
            ? `${fabricanteSelecionado} ${modeloSelecionado || ""}`
            : modeloSelecionado || "-"
        ).trim(),
        destino,
        original: produtoSelecionado,
        resumoFuncional: resumoFunc,
        prioridadeConflito: prioridadeConflito.trim(),
        liga,
      },
    ]);

    setItensRaw((prev) => prev.filter((i) => i.id !== produtoSelecionado.id));

    setModalAberto(false);
    setProdutoSelecionado(null);
    setEtapaAtual(1);
    setPrioridadeConflito("");
    setHistorico([]);
  };
  useEffect(() => {
    if (!fotoSerie) {
      setFotoPreview("");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => setFotoPreview(String(event.target?.result || ""));
      reader.onerror = () => setFotoPreview("");
      reader.readAsDataURL(fotoSerie);
    } catch (error) {
      console.error("Erro ao carregar foto de série", error);
      try {
        const url = URL.createObjectURL(fotoSerie);
        setFotoPreview(url);
        return () => URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Erro ao criar URL temporária", err);
        setFotoPreview("");
      }
    }
  }, [fotoSerie]);

  useEffect(() => {
    if (!temConflito) {
      setPrioridadeConflito("");
    }
  }, [temConflito]);

  useEffect(() => {
    try {
      console.assert(EAN_PARA_MODELOS["7893299951862"].fabricante === "LG");
      console.assert(
        EAN_PARA_MODELOS["7891356122613"].modelos.includes("PTV32M9GACGB V.D"),
      );
      console.assert(obterFabricantePorModeloCodigo("55QNED80SRA") === "LG");
      console.assert(obterAcessorios("50UT8050PSA").includes("CONTROLE REMOTO"));
      const ordenados = aplicarPoliticaMaisAntigo([
        { id: 2, dataReceb: "02/01/2025" },
        { id: 1, dataReceb: "01/01/2025" },
      ]);
      console.assert(ordenados[0].habilitado === true && ordenados[0].id === 1);
      console.assert(
        extrairCodigoModelo("Modelo 55QNED80SRA LG") === "55QNED80SRA",
      );
      console.assert(obterDefeitosPorFunc("Desconhecido").length > 0);
      console.assert(baseModelo("PTV32M9GACGB V.A") === "PTV32M9GACGB");
      console.assert((EMBALAGENS_POR_EAN["7893299951862"] || []).length > 0);
      const dd = decidirDestino({
        acessorios: [{ status: "OK" }],
        pecas: [{ status: "OK" }],
        embalagens: [{ status: "OK" }],
        temDefeito: "NAO",
        aguardandoCadastroModelo: false,
        consideraEmb: true,
      });
      console.assert(dd === "CONTROLE DE QUALIDADE");
      console.assert(
        extrairCodigoModelo("PTV32M9GACGB V.B PHILCO") === "PTV32M9GACGB",
      );
      console.assert(baseModelo("50UT8050PSA.BWZJLJZ") === "50UT8050PSA");
      const dd2 = decidirDestino({
        acessorios: [{ status: "OK" }],
        pecas: [{ status: "OK" }],
        embalagens: [{ status: "OK" }],
        temDefeito: "SIM",
        aguardandoCadastroModelo: false,
        consideraEmb: true,
      });
      console.assert(dd2 === "ANÁLISE TÉCNICA");
    } catch (error) {
      console.warn("Validações iniciais ignoradas", error);
    }
  }, []);

  const Stepper = () => (
    <div className="relative">
      <div className="flex items-center justify-between gap-2">
        {STEP_LABELS.map((label, idx) => {
          const done = idx + 1 < etapaAtual;
          const active = idx + 1 === etapaAtual;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div className={`flex items-center gap-2 ${idx > 0 ? "w-full" : ""}`}>
                {idx > 0 && (
                  <div className={`h-[2px] flex-1 ${done ? "bg-blue-600" : "bg-blue-100"}`} />
                )}
                <div
                  className={`shrink-0 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold border ${
                    done
                      ? "bg-blue-600 text-white border-blue-600"
                      : active
                      ? "bg-white text-blue-700 border-blue-400 shadow"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[11px] uppercase ${
                    done || active ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  const renderTableProdutos = (
    <div className="bg-white rounded-3xl shadow-xl border border-[#d7e3ff] p-6">
      <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-800">
        Produtos aguardando pré-análise
        <span className="text-slate-400 text-xs block font-medium normal-case">
          (somente o mais antigo habilitado)
        </span>
      </h2>
      <div className="mt-4 overflow-hidden rounded-3xl border border-[#d7e3ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="max-h-[55vh] overflow-auto">
          <table className="min-w-full uppercase text-sm">
            <thead className="bg-[#d3e3ff] text-slate-800">
              <tr>
                <Th>DATA RECEBIMENTO</Th>
                <Th>RECEBIDO POR</Th>
                <Th>ID PRODUTO</Th>
                <Th>CÓDIGO NF</Th>
                <Th>MODELO REFERÊNCIA</Th>
                <Th>GTIN/EAN</Th>
                <Th>Nº NF RECEB.</Th>
                <Th>PRÉ-ANÁLISE</Th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-slate-500" colSpan={8}>
                    NENHUM REGISTRO PARA EXIBIR
                  </td>
                </tr>
              )}
              {itens.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`transition ${
                    idx % 2 ? "bg-[#f4f7ff]" : "bg-white"
                  } hover:bg-[#e6efff]`}
                >
                  <Td mono>{row.dataReceb}</Td>
                  <Td>{row.recebidoPor}</Td>
                  <Td mono>{row.lpn}</Td>
                  <Td mono>{row.sku}</Td>
                  <Td>{row.modeloRef}</Td>
                  <Td mono>{row.ean}</Td>
                  <Td mono>{row.nf}</Td>
                  <Td>
                    <button
                      type="button"
                      disabled={!row.habilitado}
                      onClick={() => iniciarPreAnalise(row)}
                      className={`px-4 py-1.5 rounded-lg text-white font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:bg-gray-400 ${
                        row.habilitado
                          ? "bg-[#2f72ff] hover:bg-[#1f5ae5] shadow"
                          : "bg-gray-400"
                      }`}
                    >
                      EFETUAR
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabelaResultados = (
    <div className="bg-white rounded-3xl shadow-xl border border-[#d7e3ff] p-6">
      <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-800">
        Dados — resultado pré-análise
      </h2>
      <div className="mt-4 overflow-hidden rounded-3xl border border-[#d7e3ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="max-h-[55vh] overflow-auto">
          <table className="min-w-full uppercase text-sm">
            <thead className="bg-[#eef2ff] text-slate-800">
              <tr>
                <Th>DATA</Th>
                <Th>ID PRODUTO</Th>
                <Th>CÓDIGO NF</Th>
                <Th>Nº SÉRIE</Th>
                <Th>MODELO REF</Th>
                <Th>MODELO FABRICANTE</Th>
                <Th>PRÉ-ANALISADO POR</Th>
                <Th>DESTINO</Th>
                <Th>AÇÕES</Th>
              </tr>
            </thead>
            <tbody>
              {avaliados.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-slate-500" colSpan={9}>
                    NENHUM PRODUTO AVALIADO
                  </td>
                </tr>
              )}
              {avaliados.map((registro, index) => (
                <tr
                  key={`${registro.lpn}-${index}`}
                  className={`transition ${
                    index % 2 ? "bg-[#f4f7ff]" : "bg-white"
                  } hover:bg-[#eaf0ff]`}
                >
                  <Td mono>{registro.data}</Td>
                  <Td mono>{registro.lpn}</Td>
                  <Td mono>{registro.sku}</Td>
                  <Td mono>{registro.numeroSerie}</Td>
                  <Td>{registro.modeloRef}</Td>
                  <Td>{registro.modeloFab || "-"}</Td>
                  <Td>{registro.preAnalista || "-"}</Td>
                  <Td>{registro.destino}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => {
                        const item = avaliados[index];
                        if (item?.original) {
                          setItensRaw((prev) =>
                            aplicarPoliticaMaisAntigo([
                              ...prev,
                              item.original,
                            ]),
                          );
                        }
                        setAvaliados((prev) => prev.filter((_, ix) => ix !== index));
                      }}
                      className="px-4 py-1.5 rounded-lg border border-[#c7d5ff] font-semibold text-slate-700 hover:bg-[#eef2ff]"
                    >
                      REAVALIAR
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFotoPreviewModal = () => {
    if (!zoomImagem) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
            <span className="font-semibold text-sm uppercase">Pré-visualização</span>
            <button
              type="button"
              onClick={() => setZoomImagem("")}
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 text-xs font-semibold"
            >
              FECHAR
            </button>
          </div>
          <div className="bg-black flex items-center justify-center p-4">
            <img
              src={zoomImagem}
              alt="Pré-visualização"
              className="max-h-[80vh] object-contain"
            />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="py-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-6 bg-gradient-to-br from-[#f5f7ff] via-white to-[#eef2ff] min-h-screen">
      {renderTableProdutos}
      {renderTabelaResultados}
      {renderFotoPreviewModal()}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-800">
                  PRÉ-ANÁLISE
                </h1>
                {produtoSelecionado && (
                  <div className="flex flex-wrap gap-2">
                    <Chip mono label={<><b>ID:</b> {produtoSelecionado.lpn}</>} />
                    <Chip mono label={<><b>NF:</b> {produtoSelecionado.sku}</>} />
                    <Chip mono label={<><b>EAN:</b> {produtoSelecionado.ean}</>} />
                    <Chip label={<><b>REF:</b> {produtoSelecionado.modeloRef}</>} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalAberto(false);
                  setProdutoSelecionado(null);
                  setEtapaAtual(1);
                }}
                className="px-3 py-1 rounded-md border font-semibold hover:bg-white"
              >
                FECHAR
              </button>
            </div>

            <div className="px-5 pt-4">
              <Stepper />
            </div>
            <div className="px-5">
              <div className="h-1 bg-blue-100 rounded">
                <div
                  className="h-1 bg-blue-600 rounded transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              {historico.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200">
                  <div className="text-xs font-semibold uppercase mb-2 text-slate-700">
                    Histórico
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs uppercase">
                    {historico.map((h, i) => (
                      <li key={i} className="font-mono">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {etapaAtual === 1 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 1 DE 6: FOTO NÚMERO DE SÉRIE DO PRODUTO</h2>
                  <div className="font-mono text-xs">
                    ID PRODUTO: <b>{produtoSelecionado?.lpn}</b> • CÓDIGO NF:
                    <b> {produtoSelecionado?.sku}</b>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      {...captureProp}
                      onChange={(event) =>
                        setFotoSerie(event.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                    >
                      TIRAR/ESCOLHER FOTO
                    </button>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={semNumeroSerie}
                        onChange={(event) => setSemNumeroSerie(event.target.checked)}
                      />
                      PRODUTO SEM NÚMERO DE SÉRIE
                    </label>
                  </div>
                  {fotoPreview && (
                    <div className="mt-2">
                      <div className="relative border rounded-xl overflow-hidden bg-black/5 ring-1 ring-slate-200">
                        <img
                          src={fotoPreview}
                          alt="FOTO Nº SÉRIE"
                          className="w-full max-h-[40vh] object-contain cursor-zoom-in"
                          onClick={() => setZoomImagem(fotoPreview)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-[11px] text-gray-500">
                          CLIQUE NA IMAGEM PARA AMPLIAR.
                        </div>
                        <button
                          type="button"
                          onClick={() => setZoomImagem(fotoPreview)}
                          className="px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow"
                        >
                          VER EM TELA CHEIA
                        </button>
                      </div>
                    </div>
                  )}
                  {!semNumeroSerie && (
                    <div className="grid gap-1">
                      <label className="text-xs font-semibold">
                        NÚMERO DE SÉRIE (OBRIGATÓRIO)
                      </label>
                      <input
                        type="text"
                        value={numeroSerie}
                        onChange={(event) =>
                          setNumeroSerie(event.target.value.toUpperCase())
                        }
                        placeholder="EX.: 206AZRD37302"
                        className="border rounded-lg px-3 py-2 uppercase placeholder-gray-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={confirmarFoto}
                      disabled={!fotoPreview && !semNumeroSerie}
                      className={`${
                        !fotoPreview && !semNumeroSerie
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } px-5 py-2 rounded-lg text-white font-semibold shadow`}
                    >
                      CONFIRMAR ETAPA
                    </button>
                  </div>
                </div>
              )}
              {etapaAtual === 2 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 2 DE 6: EMBALAGEM</h2>
                  <div className="flex flex-wrap gap-3 text-xs items-center">
                    <span>TEM EMBALAGEM</span>
                    <select
                      className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                      value={temEmbalagem}
                      onChange={(event) => setTemEmbalagem(event.target.value)}
                    >
                      <option value="SIM">SIM</option>
                      <option value="NAO">NÃO</option>
                    </select>
                  </div>
                  {temEmbalagem === "SIM" && (
                    <div className="text-[11px] text-gray-600">
                      Itens de embalagem referenciados pelo GTIN/EAN (
                      <b>{produtoSelecionado?.ean}</b>) do produto (
                      <b>{produtoSelecionado?.modeloRef}</b>). Status AMASSADO/DANIFICADO
                      exigem foto.
                    </div>
                  )}
                  {temEmbalagem === "SIM" && (
                    <div className="overflow-hidden rounded-2xl ring-1 ring-blue-200">
                      <div className="max-h-[45vh] overflow-auto">
                        <table className="min-w-full">
                          <thead className="bg-[#eaf2ff]">
                            <tr>
                              <Th>ITEM</Th>
                              <Th>STATUS</Th>
                              <Th>FOTO</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {embalagens.map((emb, idx) => (
                              <tr
                                key={`${emb.nome}-${idx}`}
                                className={idx % 2 ? "bg-[#f6f9ff]" : "bg-white"}
                              >
                                <Td>{emb.nome}</Td>
                                <Td>
                                  <select
                                    className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                                    value={emb.status}
                                    onChange={(event) =>
                                      setEmbalagens((prev) =>
                                        prev.map((it, i) =>
                                          i === idx
                                            ? { ...it, status: event.target.value }
                                            : it,
                                        ),
                                      )
                                    }
                                  >
                                    {STATUS_EMB.filter((s) => s !== "FALTANTE").map((status) => (
                                      <option key={status} value={status}>
                                        {status}
                                      </option>
                                    ))}
                                  </select>
                                </Td>
                                <Td>
                                  {precisaFoto(emb.status) ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        id={`foto-emb-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        {...captureProp}
                                        className="hidden"
                                        onChange={(event) => {
                                          const file = event.target.files?.[0];
                                          if (!file) return;
                                          const reader = new FileReader();
                                          reader.onload = (ev) =>
                                            setFotosEmb((prev) => ({
                                              ...prev,
                                              [idx]: {
                                                file,
                                                preview: String(ev.target?.result || ""),
                                              },
                                            }));
                                          reader.readAsDataURL(file);
                                        }}
                                      />
                                      <label
                                        htmlFor={`foto-emb-${idx}`}
                                        className="px-3 py-1 border rounded-md cursor-pointer text-xs hover:bg-slate-50"
                                      >
                                        FOTO
                                      </label>
                                      {fotosEmb[idx] ? (
                                        <span className="text-[11px] text-green-700">OK</span>
                                      ) : (
                                        <span className="text-[11px] text-red-700">
                                          OBRIGATÓRIA
                                        </span>
                                      )}
                                      {fotosEmb[idx] && (
                                        <FotoPreview
                                          preview={fotosEmb[idx].preview}
                                          onClear={() =>
                                            setFotosEmb((prev) => {
                                              const clone = { ...prev };
                                              delete clone[idx];
                                              return clone;
                                            })
                                          }
                                          onOpen={() => setZoomImagem(fotosEmb[idx].preview)}
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-gray-400">-</span>
                                  )}
                                </Td>
                              </tr>
                            ))}
                            {embalagens.length === 0 && (
                              <tr>
                                <td className="px-3 py-4 text-center text-gray-500" colSpan={3}>
                                  SEM ITENS
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {erroEmb && <div className="text-xs text-red-700">{erroEmb}</div>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEtapaAtual(1)}
                      className="px-5 py-2 rounded-lg border font-semibold hover:bg-white"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="button"
                      onClick={confirmarEmbalagem}
                      className="px-5 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow"
                    >
                      CONFIRMAR ETAPA
                    </button>
                  </div>
                </div>
              )}
              {etapaAtual === 3 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 3 DE 6: ACESSÓRIOS DO MODELO</h2>
                  <div className="text-[11px] text-gray-600">
                    Base de acessórios referenciada pelo GTIN/EAN (
                    <b>{produtoSelecionado?.ean}</b>) do produto (
                    <b>{produtoSelecionado?.modeloRef}</b>). Itens RISCADO/DANIFICADO exigem
                    foto.
                  </div>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-blue-200">
                    <div className="max-h-[45vh] overflow-auto">
                      <table className="min-w-full">
                        <thead className="bg-[#eaf2ff]">
                          <tr>
                            <Th>ACESSÓRIO</Th>
                            <Th>STATUS</Th>
                            <Th>FOTO</Th>
                          </tr>
                        </thead>
                        <tbody className="uppercase">
                          {acessorios.map((acc, idx) => (
                            <tr
                              key={`${acc.nome}-${idx}`}
                              className={idx % 2 ? "bg-[#f6f9ff]" : "bg-white"}
                            >
                              <Td>{acc.nome}</Td>
                              <Td>
                                <select
                                  className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                                  value={acc.status}
                                  onChange={(event) =>
                                    setAcessorios((prev) =>
                                      prev.map((it, i) =>
                                        i === idx
                                          ? { ...it, status: event.target.value }
                                          : it,
                                      ),
                                    )
                                  }
                                >
                                  {(STATUS_ACESSORIO[norm(acc.nome)] || [
                                    "OK",
                                    "FALTANTE",
                                    "RISCADO",
                                    "DANIFICADO",
                                  ]).map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </Td>
                              <Td>
                                {precisaFoto(acc.status) ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      id={`foto-acc-${idx}`}
                                      type="file"
                                      accept="image/*"
                                      {...captureProp}
                                      className="hidden"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) =>
                                          setFotosAcessorios((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              file,
                                              preview: String(ev.target?.result || ""),
                                            },
                                          }));
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                    <label
                                      htmlFor={`foto-acc-${idx}`}
                                      className="px-3 py-1 border rounded-md cursor-pointer text-xs hover:bg-slate-50"
                                    >
                                      FOTO
                                    </label>
                                    {fotosAcessorios[idx] ? (
                                      <span className="text-[11px] text-green-700">OK</span>
                                    ) : (
                                      <span className="text-[11px] text-red-700">
                                        OBRIGATÓRIA
                                      </span>
                                    )}
                                    {fotosAcessorios[idx] && (
                                      <FotoPreview
                                        preview={fotosAcessorios[idx].preview}
                                        onClear={() =>
                                          setFotosAcessorios((prev) => {
                                            const clone = { ...prev };
                                            delete clone[idx];
                                            return clone;
                                          })
                                        }
                                        onOpen={() => setZoomImagem(fotosAcessorios[idx].preview)}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-gray-400">-</span>
                                )}
                              </Td>
                            </tr>
                          ))}
                          {acessorios.length === 0 && (
                            <tr>
                              <td className="px-3 py-4 text-center text-gray-500" colSpan={3}>
                                SEM ITENS
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {erroAcessorios && (
                    <div className="text-xs text-red-700">{erroAcessorios}</div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEtapaAtual(2)}
                      className="px-5 py-2 rounded-lg border font-semibold hover:bg-white"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="button"
                      onClick={confirmarAcessorios}
                      className="px-5 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow"
                    >
                      CONFIRMAR ETAPA
                    </button>
                  </div>
                </div>
              )}
              {etapaAtual === 4 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 4 DE 6: SELECIONAR MODELO FABRICANTE</h2>
                  <div className="text-xs text-gray-600">MODELO DISPONÍVEL *</div>
                  <select
                    className="border rounded-lg px-2 py-2 bg-white w-full ring-1 ring-slate-200"
                    value={modeloSelecionado}
                    onChange={(event) => setModeloSelecionado(event.target.value)}
                  >
                    <option value="">SELECIONAR MODELO</option>
                    {listaModelos.map((modelo) => (
                      <option key={modelo} value={modelo}>
                        {modelo}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={aguardandoCadastroModelo}
                        onChange={(event) =>
                          setAguardandoCadastroModelo(event.target.checked)
                        }
                      />
                      SOLICITAR CADASTRO DE MODELO/FABRICANTE
                    </label>
                  </div>
                  {erroModelo && (
                    <div className="text-red-600 text-xs">{erroModelo}</div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEtapaAtual(3)}
                      className="px-5 py-2 rounded-lg border font-semibold hover:bg-white"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="button"
                      onClick={confirmarModelo}
                      className="px-5 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow"
                    >
                      CONFIRMAR ETAPA
                    </button>
                  </div>
                </div>
              )}

              {etapaAtual === 5 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 5 DE 6: VERIFICAÇÃO ESTÉTICA</h2>
                  <div className="text-[11px] text-gray-600">
                    Referente ao modelo fabricante selecionado (
                    <b>
                      {(fabricanteSelecionado
                        ? `${fabricanteSelecionado} ${modeloSelecionado}`
                        : modeloSelecionado) || "-"}
                    </b>
                    ). Itens RISCADO/DANIFICADO exigem foto.
                  </div>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-blue-200">
                    <div className="max-h-[45vh] overflow-auto">
                      <table className="min-w-full">
                        <thead className="bg-[#eaf2ff]">
                          <tr>
                            <Th>PEÇA</Th>
                            <Th>STATUS</Th>
                            <Th>FOTO</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {pecas.map((peca, idx) => (
                            <tr
                              key={`${peca.nome}-${idx}`}
                              className={idx % 2 ? "bg-[#f6f9ff]" : "bg-white"}
                            >
                              <Td>{peca.nome}</Td>
                              <Td>
                                <select
                                  className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                                  value={peca.status}
                                  onChange={(event) =>
                                    setPecas((prev) =>
                                      prev.map((it, i) =>
                                        i === idx
                                          ? { ...it, status: event.target.value }
                                          : it,
                                      ),
                                    )
                                  }
                                >
                                  {STATUS_ESTATICA.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </Td>
                              <Td>
                                {("RISCADO" === peca.status || "DANIFICADO" === peca.status) ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      id={`foto-pec-${idx}`}
                                      type="file"
                                      accept="image/*"
                                      {...captureProp}
                                      className="hidden"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) =>
                                          setFotosPecas((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              file,
                                              preview: String(ev.target?.result || ""),
                                            },
                                          }));
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                    <label
                                      htmlFor={`foto-pec-${idx}`}
                                      className="px-3 py-1 border rounded-md cursor-pointer text-xs hover:bg-slate-50"
                                    >
                                      FOTO
                                    </label>
                                    {fotosPecas[idx] ? (
                                      <span className="text-[11px] text-green-700">OK</span>
                                    ) : (
                                      <span className="text-[11px] text-red-700">
                                        OBRIGATÓRIA
                                      </span>
                                    )}
                                    {fotosPecas[idx] && (
                                      <FotoPreview
                                        preview={fotosPecas[idx].preview}
                                        onClear={() =>
                                          setFotosPecas((prev) => {
                                            const clone = { ...prev };
                                            delete clone[idx];
                                            return clone;
                                          })
                                        }
                                        onOpen={() => setZoomImagem(fotosPecas[idx].preview)}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-gray-400">-</span>
                                )}
                              </Td>
                            </tr>
                          ))}
                          {pecas.length === 0 && (
                            <tr>
                              <td className="px-3 py-4 text-center text-gray-500" colSpan={3}>
                                SEM ITENS
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {erroPecas && <div className="text-xs text-red-700">{erroPecas}</div>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEtapaAtual(4)}
                      className="px-5 py-2 rounded-lg border font-semibold hover:bg-white"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="button"
                      onClick={confirmarPecas}
                      className="px-5 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow"
                    >
                      CONFIRMAR ETAPA
                    </button>
                  </div>
                </div>
              )}
              {etapaAtual === 6 && (
                <div className="space-y-3 uppercase text-sm">
                  <h2 className="font-bold">ETAPA 6 DE 6: DEFEITO FUNCIONAL</h2>
                  <div className="font-mono text-xs">
                    FABRICANTE: {fabricanteSelecionado || "-"} • MODELO: {modeloSelecionado || "-"}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs items-center">
                    <span>ESTADO DE ENERGIA</span>
                    <select
                      className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                      value={liga}
                      onChange={(event) => setLiga(event.target.value)}
                    >
                      <option value="LIGA">LIGA</option>
                      <option value="NÃO LIGA">NÃO LIGA</option>
                    </select>
                  </div>
                  {liga === "NÃO LIGA" && (
                    <div className="p-3 rounded-xl bg-yellow-50 ring-1 ring-yellow-200 text-xs">
                      Produto não liga. Não há como testar funcionalidades. Será considerado DEFEITO FUNCIONAL.
                    </div>
                  )}
                  {liga === "LIGA" && (
                    <>
                      {telaSemImagem && (
                        <div className="p-3 rounded-xl bg-orange-50 ring-1 ring-orange-200 text-xs">
                          Defeito "SEM IMAGEM" em TELA informado. As demais funcionalidades devem ser consideradas "NÃO TESTADAS".
                        </div>
                      )}
                      <div className="overflow-hidden rounded-2xl ring-1 ring-blue-200">
                        <div className="max-h-[45vh] overflow-auto">
                          <table className="min-w-full">
                            <thead className="bg-[#eaf2ff]">
                              <tr>
                                <Th>FUNCIONALIDADE</Th>
                                <Th>STATUS</Th>
                                <Th>DEFEITO (SE NÃO OK)</Th>
                              </tr>
                            </thead>
                            <tbody>
                              {funcionalidades.map((func, idx) => {
                                const disabled = telaSemImagem && norm(func.nome) !== "TELA";
                                return (
                                  <tr
                                    key={`${func.nome}-${idx}`}
                                    className={idx % 2 ? "bg-[#f6f9ff]" : "bg-white"}
                                  >
                                    <Td>{func.nome}</Td>
                                    <Td>
                                      <select
                                        className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                                        value={func.status}
                                        disabled={disabled}
                                        onChange={(event) =>
                                          setFuncionalidades((prev) =>
                                            prev.map((item, i) =>
                                              i === idx
                                                ? {
                                                    ...item,
                                                    status: event.target.value,
                                                    defeito:
                                                      event.target.value === "OK"
                                                        ? ""
                                                        : item.defeito,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                      >
                                        <option value="OK">OK</option>
                                        <option value="NÃO OK">NÃO OK</option>
                                      </select>
                                    </Td>
                                    <Td>
                                      {func.status === "NÃO OK" ? (
                                        <select
                                          className="border rounded-lg px-2 py-1 bg-white ring-1 ring-slate-200"
                                          value={func.defeito}
                                          onChange={(event) =>
                                            setFuncionalidades((prev) =>
                                              prev.map((item, i) =>
                                                i === idx
                                                  ? { ...item, defeito: event.target.value }
                                                  : item,
                                              ),
                                            )
                                          }
                                        >
                                          <option value="">SELECIONAR DEFEITO</option>
                                          {obterDefeitosPorFunc(func.nome).map((defeito) => (
                                            <option key={defeito} value={defeito}>
                                              {defeito}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-[11px] text-gray-400">-</span>
                                      )}
                                    </Td>
                                  </tr>
                                );
                              })}
                              {funcionalidades.length === 0 && (
                                <tr>
                                  <td className="px-3 py-4 text-center text-gray-500" colSpan={3}>
                                    SEM FUNCIONALIDADES CADASTRADAS
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {temFuncionalDefeito && resumoFunc.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold mb-2">Resumo dos defeitos informados</div>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        {resumoFunc.map((texto, idx) => (
                          <li key={idx} className="font-mono normal-case">
                            {texto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {temConflito && (
                    <div className="space-y-2 p-3 rounded-xl bg-red-50 ring-1 ring-red-200">
                      <div className="text-xs font-semibold text-red-700">
                        Conflito detectado entre defeitos de TELA e HDMI/SINTONIZADOR. Informe prioridade de atendimento.
                      </div>
                      <textarea
                        className="w-full border rounded-lg px-3 py-2 text-xs ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 normal-case"
                        rows={3}
                        value={prioridadeConflito}
                        onChange={(event) => setPrioridadeConflito(event.target.value)}
                        placeholder="Descreva qual defeito deve ser priorizado e justificativa"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setEtapaAtual(5)}
                      className="px-5 py-2 rounded-lg border font-semibold hover:bg-white"
                    >
                      VOLTAR
                    </button>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      {faltamDefinirDefeitos && liga === "LIGA" && (
                        <span className="text-xs text-red-700">
                          Defina o defeito para todas as funcionalidades marcadas como "NÃO OK".
                        </span>
                      )}
                      {temConflito && !prioridadeConflito.trim() && (
                        <span className="text-xs text-red-700">
                          Informe a prioridade do conflito antes de finalizar.
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={finalizar}
                        disabled={
                          (liga === "LIGA" && faltamDefinirDefeitos) ||
                          (temConflito && !prioridadeConflito.trim())
                        }
                        className={`px-5 py-2 rounded-lg text-white font-semibold shadow ${
                          (liga === "LIGA" && faltamDefinirDefeitos) ||
                          (temConflito && !prioridadeConflito.trim())
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        FINALIZAR PRÉ-ANÁLISE
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
