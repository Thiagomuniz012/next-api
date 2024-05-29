import fs from 'fs';
import path from 'path';
import url from 'url';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Caminho para o arquivo de banco de dados
const dbPath = path.join(process.cwd(), 'src', 'data', 'pessoa.json');

// Array para armazenar as pessoas
let pessoas = [];

// Função para ler os dados do arquivo e carregá-los no array pessoas
function lerDadosDoArquivo() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    pessoas = JSON.parse(data).map(pessoa => ({ ...pessoa, id: uuidv4() }));
  } catch (error) {
    console.error('Erro ao ler o arquivo de dados:', error);
  }
}

// Função para salvar os dados do array pessoas no arquivo
function salvarDadosNoArquivo() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(pessoas, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao salvar os dados no arquivo:', error);
  }
}

// Inicializar lendo os dados do arquivo
lerDadosDoArquivo();

// Middleware CORS para lidar com requisições de diferentes origens
const corsMiddleware = cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Função principal para lidar com as requisições HTTP
export default function handler(req, res) {
  // Executar o middleware CORS
  corsMiddleware(req, res, async () => {
    console.log('URL:', req.url);
    console.log('Query:', req.query);

    // Verificar o método da requisição
    if (req.method === 'GET') {
      const { pathname, query } = url.parse(req.url, true);
      const id = query.id;

      if (id) {
        // Se a requisição incluir um ID, encontrar a pessoa correspondente
        const pessoa = pessoas.find(pessoa => pessoa.id === id);
        if (pessoa) {
          res.status(200).json([pessoa]);
        } else {
          res.status(404).json({ error: 'Pessoa não encontrada' });
        }
      } else {
        // Se não incluir um ID, retornar todas as pessoas
        res.status(200).json(pessoas);
      }
    } else if (req.method === 'POST') {
      // Lidar com a adição de uma nova pessoa
      let novaPessoa = req.body;
      novaPessoa.id = uuidv4();
      pessoas.push(novaPessoa);
      salvarDadosNoArquivo();
      res.status(201).json(novaPessoa);
    } else if (req.method === 'PUT') {
      // Lidar com a atualização de uma pessoa existente
      const { pathname, query } = url.parse(req.url, true);
      const id = query.id;
      const pessoaAtualizada = req.body;
      const index = pessoas.findIndex(pessoa => pessoa.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Pessoa não encontrada' });
      } else {
        pessoas[index] = { ...pessoas[index], ...pessoaAtualizada };
        salvarDadosNoArquivo();
        res.status(200).json(pessoas[index]);
      }
    } else if (req.method === 'DELETE') {
      // Lidar com a remoção de uma pessoa
      const { pathname, query } = url.parse(req.url, true);
      const id = query.id;
      const index = pessoas.findIndex(pessoa => pessoa.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Pessoa não encontrada' });
      } else {
        pessoas.splice(index, 1);
        salvarDadosNoArquivo();
        res.status(200).json({ message: 'Pessoa removida com sucesso' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
