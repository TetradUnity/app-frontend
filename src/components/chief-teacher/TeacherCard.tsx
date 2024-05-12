import Link from "next/link";
import { CSSProperties } from "react"

const divStyle: CSSProperties = {
    background: "rgb(38,38,38)",
    borderRadius: 10,
    overflow: "clip",
    height: 135,
    zIndex: 1,
    position: "relative"
};

const bgImgStyle: CSSProperties = {
    height: "100%",
    width: "100%",
    // objectFit: "cover",
    objectFit: "fill",
    
    background: "linear-gradient(to right, rgba(0,0,0,0) 10%, rgba(38,38,38, 1) 100%), ",
    filter: "blur(10px)",

    position: "absolute",
    zIndex: 2
}

const imgStyle: CSSProperties = {
    width: 200,
    height: "100%",
    objectFit: "cover",
    display: "inline-block",
    verticalAlign: "middle",
    
    position: "relative",
    zIndex: 3
}

const divInfoStyle: CSSProperties = {
    display: "inline-block",
    padding: 20,
    verticalAlign: "middle",
    
    position: "relative",
    zIndex: 3
};

const textStyle: CSSProperties = {
    textShadow: "rgba(0,0,0,.6) 1px 0 20px",
    color: "white"
};

export function TeacherCard({item: {name, img}} : {item: {name: string, img: string}}) {
    return (
        <div style={divStyle}>
            <div style={{...bgImgStyle, background: bgImgStyle.background + "url(" + img + ")"}} />
            <img style={imgStyle} alt="subject_cover" src={img} />
            <div style={divInfoStyle}>
                <Link href="/">
                    <h1 style={textStyle}>{name}</h1>
                </Link>
                <p style={textStyle}>Кількість предметів: 1</p>
            </div>
        </div>
    )
}