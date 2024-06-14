import { Divider } from "antd";
import { CSSProperties } from "react";

import styles from "../styles.module.css"
import Tiptap from "@/components/Tiptap";

export default function FaqTextFormattingPage() {
    return (
        <div>
            <h1>Форматування тексту</h1>
            
            <Divider />

            <section className={styles.section}>
              <h3>За допомогою кнопок:</h3>
              <p>
                Виділіть текст, і над ним з'явиться меню, в якому будуть доступні такі опції, як:
                зробити текст жирним/курсивом; закреслити/підкреслити текст;
                зробити впорядкований/маркірований список (не всюди доступно), як на картинці нижче:
              </p>
              <img style={{display: "block", margin: "auto", marginTop: 10}} src="/imgs/text_formatting.jpg" alt="text formatting bubble menu" />
            </section>

            <section className={styles.section}>
              <h3>Швидке форматування тексту:</h3>

              <ul>
                <li>
                  Фрагмент тексту, який хочете зробити <b>жирним</b>, напишіть між подвійними зірочками
                  (наприклад: **текст**)
                </li>
                <li>
                  Фрагмент тексту, який хочете зробити <i>курсивом</i>, напишіть між зірочками
                  (наприклад: *текст*)
                </li>
                <li>
                  Фрагмент тексту, який хочете <s>закреслити</s>, напишіть між подвійними тільдами
                  (наприклад: ~~текст~~)
                </li>
                <li>
                  Фрагмент тексту, який хочете <u>підкреслити</u>, напишіть між знаками нижнього підкреслення
                  (наприклад: _текст_)
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h3>За допомогою комбінацій клавіш на клавіатурі:</h3>

              <ul>
                <li>
                  Виділіть фрагмент тексту, і натисніть <code>Control + B</code>, щоб зробити текст <b>жирним</b>
                </li>
                <li>
                  Виділіть фрагмент тексту, і натисніть <code>Control + I</code>, щоб зробити текст <i>курсивом</i>
                </li>
                <li>
                  Виділіть фрагмент тексту, і натисніть <code>Control + U</code>, щоб <s>закреслити</s> текст
                </li>
                <li>
                  Виділіть фрагмент тексту, і натисніть <code>Control + Shift + X</code>, щоб <u>підкреслити</u> текст
                </li>
              </ul>
            </section>

            <Divider />

            <section className={styles.section}>
              <h3>Щодо математичних формул:</h3>

              <p>
                Напишіть математичну формулу між знаками долара (нижче посилання на сайт, де детально про це),
                наприклад: <code>$\sqrt{"{2}"}$</code>.
              </p>

              <p>
                Ми використовуємо бібліотеку <a href="https://katex.org/">KaTeX</a>.
                Докладніше про те, які позначення існують, ви можете переглянути <a href="https://katex.org/docs/supported.html#operators">тут</a>.
              </p>
            </section>
        </div>
    )
}