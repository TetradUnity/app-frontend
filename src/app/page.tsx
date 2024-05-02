'use client'

import { Button, Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";

export default function LandPage() {
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
    </Content>
  );
}
