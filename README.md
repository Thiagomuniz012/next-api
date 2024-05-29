## Como começar:

Primeiro, instale a dependência e rode a aplicação:

```bash
npm install
#and
npm run dev
```

Ela estará disponível em:

[http://localhost:3000](http://localhost:3000) Abra seu navegador para ver o resultado.

## Como testar a API pelo PowerShell:

GET:

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/pessoa" -Method Get
```

POST:

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/pessoa" -Method Post -ContentType "application/json" -Body '{"nome": "Thiago", "sobrenome": "Muniz", "email":"thiago.muniz012@gmail.com"}'
```

PUT:

Coloque o id da pessoa na url.

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/pessoa?id=<id>" -Method Put -ContentType "application/json" -Body '{"nome": "Pedro", "sobrenome": "Muniz", "email":"thiago.muniz012@gmail.com"}'
```

DELETE:

```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/pessoa?id=<id>" -Method Delete
```