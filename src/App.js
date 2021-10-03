import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import api from "./Services/api.js";
import {
  Container,
  Conteudo,
  Header,
  Form,
  Campo,
  Label,
  Input,
  Select,
  BtnAcessar,
  HeaderChat,
  ImgUsuario,
  NomeUsuario,
  ChatBox,
  ConteudoChat,
  MsgEnviada,
  DetMsgEnviada,
  TextoMsgEnviada,
  MsgRecebida,
  DetMsgRecebida,
  TextoMsgRecebida,
  EnviarMsg,
  CampoMsg,
  BtnEnviarMsg,
} from "./styles/styles.js";

let socket;

function App() {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState("");
  const [sala, setSala] = useState("");
  const [cont, setcont] = useState(0);

  /*const [logado, setLogado] = useState(true);
  const [nome, setNome] = useState("Cesar")
  const [sala, setSala] = useState("1");*/

  const [mensagem, setMensagem] = useState("");
  const [listaMensagem, setListaMensagem] = useState([]);

  useEffect(() => {
    socket = socketIOClient(process.env.REACT_APP_API_URL);

    socket.on("total", (n) => {
      setcont(JSON.stringify(n));

      console.log(n.info);
    });
  }, []);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      //  console.log(
      //  JSON.stringify(listaMensagem) + "dados " + JSON.stringify(dados)
      //);
      setListaMensagem([...listaMensagem, dados]);
    });
  });

  const conectarSala = () => {
    console.log("Acessou a sala " + sala + " com o usuário " + nome);
    setLogado(true);
    socket.emit("sala_conectar", sala);
  };

  const enviarMensagem = async () => {
    console.log("Mensagem: " + mensagem);
    const conteudoMensagem = {
      sala,
      conteudo: {
        nome,
        mensagem,
      },
    };
    console.log(conteudoMensagem);

    await socket.emit("enviar_mensagem", conteudoMensagem);
    setListaMensagem([...listaMensagem, conteudoMensagem.conteudo]);
    setMensagem("");
  };

  return (
    <Container>
      <h2 style={{ paddingLeft: "40px" }}>{cont}</h2>
      {!logado ? (
        <Conteudo>
          <Header>Meu chat sobre...</Header>
          <Form>
            <Campo>
              <Label>Nome: </Label>
              <Input
                type="text"
                placeholder="Nome"
                name="nome"
                value={nome}
                onChange={(texto) => {
                  setNome(texto.target.value);
                }}
              />
            </Campo>

            <Campo>
              <Label>Sala: </Label>
              <Select
                name="sala"
                value={sala}
                onChange={(texto) => setSala(texto.target.value)}
              >
                <option value="">Selecione</option>
                <option value="1">Node.js</option>
                <option value="2">React</option>
                <option value="3">React Native</option>
                <option value="4">PHP</option>
              </Select>
            </Campo>

            <BtnAcessar onClick={conectarSala}>Acessar</BtnAcessar>
          </Form>
        </Conteudo>
      ) : (
        <ConteudoChat>
          <HeaderChat>
            <ImgUsuario src="celke.jpg" alt={nome} />
            <NomeUsuario>{nome}</NomeUsuario>
          </HeaderChat>
          <ChatBox>
            {listaMensagem.map((msg, key) => {
              return (
                <div key={key}>
                  {nome === msg.nome ? (
                    <MsgEnviada>
                      <DetMsgEnviada>
                        <TextoMsgEnviada>
                          {msg.nome} : {msg.mensagem}
                        </TextoMsgEnviada>
                      </DetMsgEnviada>
                    </MsgEnviada>
                  ) : (
                    <MsgRecebida>
                      <DetMsgRecebida>
                        <TextoMsgRecebida>
                          {msg.nome} : {msg.mensagem}
                        </TextoMsgRecebida>
                      </DetMsgRecebida>
                    </MsgRecebida>
                  )}
                </div>
              );
            })}
          </ChatBox>
          <EnviarMsg>
            <CampoMsg
              type="text"
              name="mensagem"
              placeholder="Mensagem..."
              value={mensagem}
              onChange={(texto) => {
                setMensagem(texto.target.value);
              }}
            />

            <BtnEnviarMsg onClick={enviarMensagem}>Enviar</BtnEnviarMsg>
          </EnviarMsg>
        </ConteudoChat>
      )}
    </Container>
  );
}

export default App;
