CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             
    codigo_barras VARCHAR(50) UNIQUE,       
    descricao TEXT,                         
    preco_custo NUMERIC(12, 2) NOT NULL,    
    custo_anterior NUMERIC(12, 2),          
    custo_medio NUMERIC(12, 2),             
    preco_venda NUMERIC(12, 2) NOT NULL,   
    margem NUMERIC(6, 2) GENERATED ALWAYS AS ((preco_venda - preco_custo) / preco_custo * 100) STORED, 
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL, 
    imagem BYTEA,
    classe_id INT REFERENCES classes(id) ON DELETE SET null,                          
    ativo BOOLEAN DEFAULT TRUE,             
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estoque_filial (
    id SERIAL PRIMARY KEY,
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Relacionado ao produto
    quantidade DECIMAL(10, 2),                  -- Quantidade em estoque
    estoque_minimo INTEGER DEFAULT 0,           -- Estoque mínimo
    UNIQUE (filial_id, produto_id)              -- Garante que não haja duplicação
);



CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,          -- ID único para cada classe
    nome VARCHAR(255) NOT NULL,     -- Nome da classe (ex.: 350ML, 1L, etc.)
    descricao TEXT,                 -- Descrição adicional da classe (opcional)
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP-- Data de atualização
);


CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,             -- Nome do fornecedor
    cnpj VARCHAR(20) UNIQUE NOT NULL,       -- CNPJ
    telefone VARCHAR(20),                   -- Telefone
    endereco TEXT,                          -- Endereço
    email VARCHAR(255),                     -- Email para contato
    estado VARCHAR(2),                      -- Estado
    cidade VARCHAR(100),
    cep VARCHAR(8)                    -- Cidade
    ativo BOOLEAN DEFAULT TRUE,             -- Status do fornecedor
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE produto_fornecedores (
    id SERIAL PRIMARY KEY,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Produto
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE, -- Fornecedor
    preco_custo NUMERIC(12, 2) NOT NULL, -- Preço de custo fornecido por este fornecedor
    prazo_entrega INTEGER DEFAULT 0,     -- Prazo de entrega em dias (opcional)
    UNIQUE (produto_id, fornecedor_id)   -- Garante que um fornecedor não esteja duplicado para o mesmo produto
);


CREATE TABLE filiais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,          -- Nome da filial
    codigo VARCHAR(20) UNIQUE NOT NULL,  -- Código identificador da filial
    cnpj VARCHAR(18) UNIQUE NOT NULL,    -- CNPJ da filial (Formato: 00.000.000/0000-00)
    telefone VARCHAR(20),                -- Telefone da filial
    cep VARCHAR(9),                      -- CEP da filial (Formato: 00000-000)
    endereco TEXT,                        -- Endereço completo da filial
    cidade VARCHAR(100),                  -- Cidade onde a filial está localizada
    estado VARCHAR(2),                    -- Sigla do estado (ex: SP, RJ)
    ativo BOOLEAN DEFAULT TRUE,           -- Status da filial
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE, -- CPF ou CNPJ, formato: 000.000.000-00 ou 00.000.000/0000-00
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100), -- 🔹 Adiciona o campo para armazenar a cidade
    estado VARCHAR(2), -- 🔹 Adiciona o campo para armazenar a sigla do estado (ex: SP, RJ)
    ativo BOOLEAN DEFAULT TRUE, -- Status do cliente
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Atualizar a tabela 'entradas' para incluir a filial
CREATE TABLE entradas (
    id SERIAL PRIMARY KEY,
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE, -- Relacionado ao fornecedor
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da entrada
    total NUMERIC(12, 2) NOT NULL, -- Total da entrada
    observacoes TEXT, -- Observações opcionais
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atualizar a tabela 'itens_entrada' para incluir a filial
CREATE TABLE itens_entrada (
    id SERIAL PRIMARY KEY,
    entrada_id INT REFERENCES entradas(id) ON DELETE CASCADE, -- Relacionado à entrada
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE, -- Relacionado ao produto
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE SET NULL, -- Relacionado ao fornecedor
    filial_id INT REFERENCES filiais(id) ON DELETE CASCADE, -- Relacionado à filial
    quantidade NUMERIC(10,3) NOT NULL, -- Permite valores fracionados (kg, g, etc.)
    preco_custo NUMERIC(12, 2) NOT NULL, -- Preço de custo do produto na entrada
    subtotal NUMERIC(12, 3) GENERATED ALWAYS AS (quantidade * preco_custo) STORED -- Subtotal calculado corretamente
);


CREATE TABLE niveis_acesso (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    filial_id INT REFERENCES filiais(id) ON DELETE SET NULL,
    nivel_acesso_id INT REFERENCES niveis_acesso(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operadores (
    id SERIAL PRIMARY KEY,
    filial_id INT REFERENCES filiais(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL, -- Ex: "Caixa", "Gerente"
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendas_pagamento (
    id SERIAL PRIMARY KEY,
    venda_id INT REFERENCES vendas(id) ON DELETE CASCADE,
    forma_pagamento_id INT REFERENCES formas_pagamento(id) ON DELETE RESTRICT,
    valor DECIMAL(10,2) NOT NULL
    troco DECIMAL(10,2)
);

-- Tabela de Ofertas e Descontos
CREATE TABLE ofertas (
    id SERIAL PRIMARY KEY,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- "percentual" ou "fixo"
    valor DECIMAL(10,2) NOT NULL, -- Se for percentual, representa %
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(100), -- Pode ser NULL para clientes não identificados
    data_pedido DATE DEFAULT CURRENT_DATE, -- Apenas a data do pedido
    hora_pedido TIME DEFAULT CURRENT_TIME, -- Apenas a hora do pedido
    status CHAR(1) DEFAULT 'P' CHECK (status IN ('P', 'F')), -- "P" = Pendente, "F" = Finalizado
    total DECIMAL(10,2) DEFAULT 0.00,
    taxa_entrega DECIMAL(10,2) DEFAULT 0.00, -- Taxa de entrega separada
    observacao TEXT, -- Campo para observações gerais do pedido
    filial_id INT NOT NULL, -- ID da filial responsável pelo pedido
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_filial FOREIGN KEY (filial_id) REFERENCES filiais(id) ON DELETE CASCADE
);

-- Tabela de Itens do Pedido
CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade DECIMAL(10,3) NOT NULL CHECK (quantidade > 0), -- ✅ Agora permite valores quebrados
    preco_unitario DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0.00, -- Desconto por item
    total DECIMAL(10,2) NOT NULL, -- Total por item considerando desconto
    data_item DATE DEFAULT CURRENT_DATE, -- Data do item no pedido
    hora_item TIME DEFAULT CURRENT_TIME, -- Hora do item no pedido
    filial_id INT NOT NULL, -- ID da filial associada ao item do pedido
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_itens_filial FOREIGN KEY (filial_id) REFERENCES filiais(id) ON DELETE CASCADE
);

CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE SET NULL,
    operador_id INT REFERENCES operadores(id) ON DELETE SET NULL,
    filial_id INT REFERENCES filiais(id) ON DELETE SET NULL,
    cliente VARCHAR(100),
    data_venda DATE DEFAULT CURRENT_DATE,  
    hora_venda TIME DEFAULT CURRENT_TIME,  
    total DECIMAL(10,2) DEFAULT 0.00,
    troco DECIMAL(10,2) DEFAULT 0.00,  -- 🔹 Agora incluído
    status VARCHAR(20) DEFAULT 'Concluída'
);

CREATE TABLE formas_pagamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE vendas_itens (
    id SERIAL PRIMARY KEY,
    venda_id INT REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL
);


-- Índices para performance
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_ofertas_data ON ofertas(data_inicio, data_fim);
