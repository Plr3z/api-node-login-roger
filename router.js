import { Router } from "express";
import controllerLogin from "./controllers/controller-login.js";

const router = Router()

router.get('/user', controllerLogin.getUsers)
router.post('/user', controllerLogin.setarCadastro)
router.post('/login', controllerLogin.loginUser)
router.delete('/cadastro', controllerLogin.deleteAllUsers)

export default router