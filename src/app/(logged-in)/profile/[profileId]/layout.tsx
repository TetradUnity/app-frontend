"use client"

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Layout } from "antd";
import { UserService } from "@/services/user.service";
import { useAppStore } from "@/stores/appStore";
import { useQueryProfileStore } from "@/stores/queryProfileStore";
import { useProfileStore } from "@/stores/profileStore";

export default function ProfileLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    const params = useParams();
    let { profileId: slug } = params;

    const setIsLoading = useAppStore(store => store.setLoading);
    const setFailedToLoad = useAppStore(store => store.setFailedToLoad);

    const [profileLoaded, setProfileLoaded] = useState(false);

    const updateQueryProfile = useQueryProfileStore(store => store.updateProfile);

    const myProfileId = useProfileStore(store => store.id);
    const [isNotFound, setNotFound] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        let profileId = parseInt(slug as string);

        if (!profileId || profileId < 0) {
            setNotFound(true);
            return;
        }

        UserService.getProfile(profileId).then(response => {
            setIsLoading(false);
            if (!response.success) {
                if (response.error_code == "user_not_found") {
                    setNotFound(true);
                    return;
                }
                setFailedToLoad(true);
                return;
            }

            if (response.data) {
                setProfileLoaded(true);
                updateQueryProfile({
                    ...response.data,
                    isMe: myProfileId == response.data.id
                });
            }
        })
    }, []);
    
    if (isNotFound) {
        notFound();
    }

    if (!profileLoaded) {
        return null;
    }

    return (
        <Layout style={{gap:'var(--gap)'}}>
            {children}
        </Layout>
    )
}