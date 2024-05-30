import { create } from "zustand";
import { devtools } from "zustand/middleware";

type answerType = number | number[] | string | null;

type State = {
    answers: answerType[]
};

type Action = {
    setAnswer: (questionId: number, value: answerType) => void
};

export const useTestStore = create<State & Action>(set => ({
    answers: [],

    setAnswer: (questionId, value) => set(state => {
        state.answers[questionId] = value;
        return {...state};
    })
}));