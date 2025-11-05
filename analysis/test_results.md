# Execução de testes

Foi tentado empacotar `src/TelaPreAnalise.jsx` com o esbuild para garantir que o componente React compile sem erros de sintaxe. O comando falhou porque o registro do npm negou acesso (HTTP 403), impedindo o download do esbuild neste ambiente.

```
npx --yes esbuild src/TelaPreAnalise.jsx --bundle --platform=browser --format=esm --log-level=error --outfile=/tmp/tela.js
```

Resultado: **Falhou** — o registro do npm retornou 403 Forbidden.
