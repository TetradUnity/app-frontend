'use client'

import { Button, Flex, message } from "antd";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LandPage() {
  const searchParams = useSearchParams();

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const err = searchParams.get("err");
  useEffect(() => {
    if (err) {
      messageApi.error(err);
      router.replace(location.pathname);
    }
  })

  return (
    <Content>
      <Flex style={{padding: 20}} vertical justify="center" align="center" gap={20}>
        <p style={{fontSize: 30}}>Головна</p>

        <Link href="/login">
          <Button type="primary">Увійти в акаунт</Button>
        </Link>
        <Link href="/register">
          <Button type="primary">Створити новий акаунт</Button>
        </Link>
      </Flex>
      {contextHolder}
    </Content>
  );
}
