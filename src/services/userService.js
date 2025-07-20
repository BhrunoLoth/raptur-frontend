const API_BASE     = import.meta.env.VITE_API_URL;
const API_USUARIOS = `${API_BASE}/usuarios`;
const API_LOGIN    = `${API_BASE}/auth/login`;

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function login(email, senha) {
  const res = await fetch(API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.erro || err.message || 'Credenciais inválidas.');
  }

  const data = await res.json();
  if (data.token) {
    // Padroniza os campos do usuário
    let usuario = { ...data.usuario };
    let perfil = usuario.perfil;
    let subtipo = usuario.subtipo_passageiro || usuario.tipo || '';
    if (perfil !== 'admin' && perfil !== 'motorista') perfil = 'passageiro';

    usuario.perfil = perfil;
    usuario.subtipo_passageiro = subtipo;

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    // NUNCA mais salve localStorage.setItem('perfil', perfil);
    data.usuario = usuario; // Atualiza retorno para uso no Login.jsx, etc.
  }
  return data;
}

export async function listarUsuarios() {
  const res = await fetch(API_USUARIOS, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(`Erro ao listar usuários (${res.status})`);
  return res.json();
}

export async function criarUsuario(dados) {
  const res = await fetch(API_USUARIOS, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(dados)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.erro || 'Erro ao criar usuário.');
  }
  return res.json();
}

export async function atualizarUsuario(id, dados) {
  const res = await fetch(`${API_USUARIOS}/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(dados)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.erro || 'Erro ao atualizar usuário.');
  }
  return res.json();
}

export async function deletarUsuario(id) {
  const res = await fetch(`${API_USUARIOS}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!res.ok) {
    throw new Error(`Erro ao deletar usuário (${res.status})`);
  }
  return res.json();
}
