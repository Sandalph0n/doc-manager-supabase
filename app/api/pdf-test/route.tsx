import { renderToBuffer } from '@react-pdf/renderer'
import { Document, Page, Text, Font, StyleSheet } from '@react-pdf/renderer'

Font.register({
    family: 'Noto Sans SC',
    fonts: [
        { src: './public/NotoSansSC-Regular.ttf', fontWeight: 400 },
        { src: './public/NotoSansSC-Bold.ttf', fontWeight: 700 },
    ],
})

export async function GET() {
    const pdf = await renderToBuffer(
        <Document>
            <Page style={{ fontFamily: 'Noto Sans SC', padding: 40 }}>
                <Text>中文测试 — Tiếng Việt có dấu — English </Text>
            </Page>
        </Document>
    )

    return new Response(new Uint8Array(pdf), {
        headers: { 'Content-Type': 'application/pdf' }
    })
}