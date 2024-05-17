"use client"

import ProfileHead from "@/components/profile/ProfileHead";
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

    useEffect(() => {
        setIsLoading(true);

        let profileId = parseInt(slug as string);

        if (!profileId || profileId < 0) {
            notFound();
        }

        UserService.getProfile(profileId).then(response => {
            if (!response.success) {
                if (response.error_code == "user_not_found") {
                    notFound();
                }
                setFailedToLoad(true);
                return;
            }

            if (response.data) {
                console.log(response.data)
                setIsLoading(false);
                setProfileLoaded(true);
                updateQueryProfile({
                    ...response.data,
                    isMe: myProfileId == response.data.id
                });
            }
        })
    }, []);

    if (!profileLoaded) {
        return null;
    }

    return (
        <Layout style={{gap:'var(--gap)'}}>
            <ProfileHead/>
            {children}
        </Layout>
    )
}