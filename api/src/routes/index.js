import { Router } from 'express';

// Público/Usuário
import authRoutes from './public/auth.routes.js';
import produtosRoutes from './public/produtos.routes.js';
import meRoutes from './public/me.routes.js';
import carrinhoRoutes from './public/carrinho.routes.js';
import pedidosRoutes from './public/pedidos.routes.js';

// Admin
import adminUsuariosRoutes from './admin/admin.usuarios.routes.js';
import adminProdutosRoutes from './admin/admin.produtos.routes.js';
import adminPedidosRoutes from './admin/admin.pedidos.routes.js';

// Mais para frente middlewares de auth/authorize
// import { auth } from '../middlewares/auth.js';
// import { authorize } from '../middlewares/authorize.js';

const router = Router();

// Saúde
router.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Público/Usuário
router.use('/auth', authRoutes);
router.use('/produtos', produtosRoutes);
router.use('/me', /* auth, */ meRoutes);
router.use('/carrinho', /* auth, */ carrinhoRoutes);
router.use('/pedidos',  /* auth, */ pedidosRoutes);

// Admin (proteger com auth + authorize('ADMIN'))
router.use('/admin/usuarios', /* auth, authorize('ADMIN'), */ adminUsuariosRoutes);
router.use('/admin/produtos', /* auth, authorize('ADMIN'), */ adminProdutosRoutes);
router.use('/admin/pedidos',  /* auth, authorize('ADMIN'), */ adminPedidosRoutes);

export default router;
