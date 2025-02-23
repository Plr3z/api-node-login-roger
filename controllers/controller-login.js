import dbCliente from "../db/db.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: '', //email
    pass: 'bzqr klmt hzfw uqdv' //senha
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'plrezende02@gmail.com',
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

const setarCadastro = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Dados são obrigatorios!.' });
      }
  
      
      const existingUser = await dbCliente.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        return res.status(409).json({ message: 'Usuario já existe!.' });
      }

      await sendEmail(
        email,
        'Cadastro Recebido',
        'Recebemos sua solicitação de cadastro. Em breve, você será notificado sobre o status do seu cadastro.'
      );
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await dbCliente.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        }
      });
  
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Erro durante o registro:', error);
      return res.status(500).json({ message: 'Erro durante o registro' });
    }
  };

const getUsers = async (req, res) => {
  try {
    const users = await dbCliente.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao encontrar usuarios:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await dbCliente.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};


const deleteAllUsers = async (req, res) => {
    try {
      await dbCliente.user.deleteMany({});
      return res.status(200).json({ message: 'Todos os usuários foram deletados com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar usuários:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

export default { getUsers, setarCadastro, loginUser, deleteAllUsers };
