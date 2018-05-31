import {
    BinaryProtocol,
    BufferedTransport,
    getProtocol,
    getTransport,
    IProtocolConstructor,
    ITransportConstructor,
    ProtocolType,
    StructLike,
    TProtocol,
    TransportType,
    TTransport,
} from '@creditkarma/thrift-server-core'

export function encode(
    thriftObject: StructLike,
    Transport: ITransportConstructor = BufferedTransport,
    Protocol: IProtocolConstructor = BinaryProtocol,
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const transport: TTransport = new Transport()
        const protocol: TProtocol = new Protocol(transport)
        thriftObject.write(protocol)
        const data = protocol.flush()
        resolve(data)
    })
}

export function appendThriftObject<T extends StructLike>(
    value: T,
    data: Buffer,
    transportType: TransportType = 'buffered',
    protocolType: ProtocolType = 'binary',
): Promise<Buffer> {
    const Transport: ITransportConstructor = getTransport(transportType)
    const Protocol: IProtocolConstructor = getProtocol(protocolType)
    return encode(value, Transport, Protocol).then((encoded: Buffer) => {
        return Buffer.concat([ encoded, data ])
    })
}
