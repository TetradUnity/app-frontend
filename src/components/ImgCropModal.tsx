'use client';

import ImgCrop, { ImgCropProps } from "antd-img-crop";
import React from "react";

type props = {
    children: React.ReactElement
} & ImgCropProps;

export default function ImgCropModal(props : props) {
    return (
        <ImgCrop
            modalTitle="Змінити зображення"
            modalOk="Готово"
            modalCancel="Відмінити"
            resetText="Скинути"
            quality={0.9}
            aspect={1/1}
            cropShape="rect"
            fillColor="black"
            zoomSlider
            showGrid
            showReset
            modalClassName="imgcrop_modal"
            {...props}
        />
    )
}