import multer from 'multer'; // multer trata com formulários de tipo MULTPART-FORM-DATA, para upload de arquivos
import crypto from 'crypto'; // importa uma biblioteca do Node chamada crypto, para gerar caracterea aleatórios

// importa de path: extname - busca nome da extensao do arquivo; resolve - percorre um caminho no diretório
import { extname, resolve } from 'path';

// exportar um objeto de configuração
export default {
  // primeira chave: storge - como o Multer vai guardar nosso arquivo de storage
  // vamos guardar os arquivos na pasta /tmp, logo vamos usar o tipo de storage: multer.diskStorage
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // vamos adicionar à cada imagem um nome de arquivo único (com caracteres aleatórios, usando o crypto)
      crypto.randomBytes(16, (err, res) => {
        // se der erro, retornar callback com errl
        if (err) return cb(err);

        // se não deu erro, retornar nulo no primeiro parametro, e o segundo parametro é o nome da imagem em si
        // retorna os 16 caracteres aleatórios no formato de um string com código em hexadecimal, juntando com
        // a extensão do arquivo
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
