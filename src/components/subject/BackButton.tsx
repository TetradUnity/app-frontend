'use client';

import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton({navTo} : {navTo?: string}) {
    const pathname = usePathname();
    const { push } = useRouter();



    return (
        <Button
            style={{display: "block"}}
            icon={<ArrowLeftOutlined />}
            type="dashed"
            shape="circle"
            onClick={() => {
                let url = navTo
                    ?  pathname.split("/").slice(0, 3).join("/") + navTo
                    : pathname.split("/").slice(0, 4).join("/");
                push(url);
            }}
        />
    )
}