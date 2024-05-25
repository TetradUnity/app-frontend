'use client';

import dynamic from 'next/dynamic';

export const EditorComp = dynamic(() => import('./InitializedMDXEditor'), { ssr: false });