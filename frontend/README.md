## Descrição
Aplicação frontend que apresenta os dados das feature flags.


## Desenvolvimento
### Instalação das dependências

```bash
$ npm install
```

### Running the app locally

```bash
$ npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000) no navegador.

### Running the app using Podman

```bash
# criação da imagem
$ podman build -t <image-name> .

# execução da imagem
$ podman run -d -p 3001:3001 <image-name>

```

### Running the app using Docker
Basta trocar os comandos acima de `podman` para `docker`

## Testes

```bash
# testes unitários
$ npm run test

# testes de integração
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```


## Tecnologias utilizadas

- [Next.js](https://nextjs.org/docs) Next.js é um framework de desenvolvimento web em JavaScript, construído sobre o React.js. Ele facilita a criação de aplicativos React com melhor desempenho, fornecendo recursos como renderização do lado do servidor (SSR) e geração de páginas estáticas.


## License

[MIT licensed](LICENSE).
