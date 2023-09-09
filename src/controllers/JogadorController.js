import { prismaClient } from "../database/prisma-client-js.js";

//Controladora para pegar todos os jogadores existentes
const getJogadores = async (request, response) => {
    try {
        const jogadores = await prismaClient.jogador.findMany();
        response.status(200).json(jogadores);
    } catch (e) {
        return response.status(500).send(e.message);
    }
}

//Controladora para pegar um jogador por id
const getJogador = async (request, response) => {
    try {
        let idParams = request.params.id;
        const jogador = await prismaClient.jogador.findUnique({
            where: { id: idParams },
        })
        if (!jogador) {
            return response.status(404).send("Jogador não encontrado!");
        }
        response.status(200).json(jogador);
    } catch (e) {
        return response.status(500).send(e.message);
    }
}

// Retorna a lista de jogadores de um time específico

const getJogadoresByTime = async (request, response) => {
    try {
        const { timeId } = request.params;

        const time = await prismaClient.time.findFirst({
            where: {
                id: timeId
            }
        });

        if (!time) {
            return response.status(404).send("Nenhum time foi encontrado!");
        }

        const jogadores = await prismaClient.time.findFirst({
            where: {
                id: timeId
            },
            include: {
                jogadores: true
            }
        });

        return response.status(200).send(jogadores);

    } catch (error) {
        return response.status(500).send(`Ocorreu um erro: ${error.message}`);
    }
}

//Controladora para criar um novo jogador passando os parametros necessarios
const createJogador = async (request, response) => {
    try {
        const { nome, idade, timeId } = request.body;

        const time = await prismaClient.time.findFirst({
            where: {
                id: timeId
            }
        })

        if (!time) {
            return response.status(404).send("O time passado por id não foi encontrado!");
        }

        const jogador = await prismaClient.jogador.create({
            data: {
                nome,
                idade,
                timeId
            },
        });

        return response.status(201).json(jogador);
    }
    catch (e) {
        return response.status(500).send(e.message);
    }
}

//Controladora para modificar um jogador pelo id
const updateJogador = async (request, response) => {
    try {
        const { timeId } = request.body;

        if (typeof timeId !== null || typeof timeId !== undefined) {
            const time = await prismaClient.time.findFirst({
                where: {
                    id: timeId
                }
            })

            if (!time) {
                return response.status(404).send("O time passado por id não foi encontrado!");
            }

        }

        const jogador = await prismaClient.jogador.findUnique({ where: { id: request.params.id } });
        if (!jogador) {
            return response.status(404).json({ err: 'Jogador não existe' });
        }
        const updatedJogador = await prismaClient.jogador.update({
            where: {
                id: request.params.id
            },
            data: {
                ...request.body
            }
        });
        return response.status(200).json(updatedJogador)
    } catch (e) {
        return response.status(500).send(e.message);
    }
}

//Controladora para deletar um jogador pelo id
const deleteJogador = async (request, response) => {
    try {
        const jogador = await prismaClient.jogador.findUnique({ where: { id: request.params.id } });
        if (!jogador) {
            return response.status(404).json({ err: 'Jogador não existe' });
        }

        const deletedJogador = await prismaClient.jogador.delete({
            where: {
                id: request.params.id
            }
        })
        return response.status(200).json(deletedJogador);

    } catch (e) {
        return response.status(500).json(e.message);
    }
}

export { getJogadores, getJogadoresByTime, createJogador, deleteJogador, getJogador, updateJogador };