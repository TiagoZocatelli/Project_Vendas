import React, { useState, useEffect } from "react";
import {
    AddProductForm,
    Input,
    ModalContainer,
    ModalContent,
    TableContainer,
} from "./styles";
import {
    Container,
    Button,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    ActionIcon,
} from '../../../styles/utils'
import { Notification } from "../../../styles/utils";

import api from '../../../api'
import { FaCheckCircle, FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";

const Filiais = () => {
    const [filiais, setFiliais] = useState([]);
    const [message, setMessage] = useState(null); // Objeto { text, type }
    const [formData, setFormData] = useState({
        nome: "",
        codigo: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFiliais();
    }, []);

    const fetchFiliais = async () => {
        try {
            const response = await api.get("/filiais");
            setFiliais(response.data || []);
        } catch (error) {
            showMessage("Erro ao buscar filiais.", "error");
        }
    };

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000); // Remove a mensagem após 3 segundos
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/filiais/${editId}`, formData);
                showMessage("Filial atualizada com sucesso!", "success");
            } else {
                await api.post("/filiais-cadastrar", formData);
                showMessage("Filial cadastrada com sucesso!", "success");
            }
            fetchFiliais();
            setFormData({
                nome: "",
                codigo: "",
                telefone: "",
                endereco: "",
                cidade: "",
                estado: "",
            });
            setShowModal(false);
        } catch (error) {
            showMessage("Erro ao salvar filial.", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/filiais/${id}`);
            showMessage("Filial excluída com sucesso!", "success");
            fetchFiliais();
        } catch (error) {
            showMessage("Erro ao excluir filial.", "error");
        }
    };

    const handleEdit = (filial) => {
        setIsEditing(true);
        setEditId(filial.id);
        setFormData(filial);
        setShowModal(true);
    };

    return (
        <Container>
            {/* Notificação */}
            {message && (
                <Notification type={message.type}>
                    {message.type === "success" ? (
                        <FaCheckCircle size={20} />
                    ) : (
                        <FaExclamationCircle size={20} />
                    )}
                    {message.text}
                </Notification>
            )}

            <h1>Gestão de Filiais</h1>
            <Button onClick={() => setShowModal(true)}>Adicionar Filial</Button>

            {/* Tabela de Filiais */}
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Número</TableHeader>
                            <TableHeader>Nome</TableHeader>
                            <TableHeader>Código</TableHeader>
                            <TableHeader>Telefone</TableHeader>
                            <TableHeader>Endereço</TableHeader>
                            <TableHeader>Cidade</TableHeader>
                            <TableHeader>Estado</TableHeader>
                            <TableHeader>Ações</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filiais) && filiais.length > 0 ? (
                            filiais.map((filial) => (
                                <TableRow key={filial.id}>
                                    <TableCell>{filial.id}</TableCell>
                                    <TableCell>{filial.nome}</TableCell>
                                    <TableCell>{filial.codigo}</TableCell>
                                    <TableCell>{filial.telefone}</TableCell>
                                    <TableCell>{filial.endereco}</TableCell>
                                    <TableCell>{filial.cidade}</TableCell>
                                    <TableCell>{filial.estado}</TableCell>
                                    <TableCell>
                                        <ActionIcon onClick={() => handleEdit(filial)}>
                                            <FaEdit size={16} style={{ color: "#FF9800" }} />
                                        </ActionIcon>
                                        <ActionIcon onClick={() => handleDelete(filial.id)}>
                                            <FaTrash size={16} style={{ color: "#f43f5e" }} />
                                        </ActionIcon>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8}>Nenhuma filial encontrada.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>

            {/* Modal */}
            {showModal && (
                <ModalContainer>
                    <ModalContent>
                        <h2>{isEditing ? "Editar Filial" : "Adicionar Filial"}</h2>
                        <form onSubmit={handleSubmit}>
                            <AddProductForm>
                                <Input
                                    name="nome"
                                    placeholder="Nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    name="codigo"
                                    placeholder="Código"
                                    value={formData.codigo}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    name="telefone"
                                    placeholder="Telefone"
                                    value={formData.telefone}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="endereco"
                                    placeholder="Endereço"
                                    value={formData.endereco}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="cidade"
                                    placeholder="Cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="estado"
                                    placeholder="Estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    maxLength={2}
                                />
                            </AddProductForm>
                            <Button type="submit">Salvar</Button>
                            <Button onClick={() => setShowModal(false)}>Cancelar</Button>
                        </form>
                    </ModalContent>
                </ModalContainer>
            )}
        </Container>
    );
};

export default Filiais;
