
import type { MenuItemType } from "antd/es/menu/hooks/useItems";

import {HomeOutlined, UserOutlined} from "@ant-design/icons";

export const studentSiderItems: MenuItemType[] = [
    {label: "Головна(student)", key: "home", icon: <HomeOutlined />},
    {label: "Акаунт", key: "account", icon: <UserOutlined />},
];