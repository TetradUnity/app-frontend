import Foreground from "@/components/Foreground";
import { Content } from "antd/es/layout/layout";

export default function FAQLayout({children}: {children?: React.ReactNode}) {
    return (
        <Content>
            <Foreground>
                {children}
            </Foreground>
        </Content>
    )
}