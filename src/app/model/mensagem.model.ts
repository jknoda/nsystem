export class MensagemModel {
    public EmpIdf: number;
    public MsgIdf: number;
    public MsgIdfIt: number;
    public MsgTexto: string;
    public MsgEmail: string;
    public MsgNome: string;
    public UsuIdf: number;
    public DataInc: Date;
    public DataAlt: Date;
    public comentarios: MensagemModel[];
}