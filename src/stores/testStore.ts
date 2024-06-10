import { TestsNamespace } from "@/types/api.types";
import { create } from "zustand";

type State = {
    answers: TestsNamespace.AnswerType[]
};

type Action = {
    setAnswer: (questionId: number, value: TestsNamespace.AnswerType) => void,
    totalQuestions: number,

    getAnswers: () => TestsNamespace.AnswerType[]
    setTotalQuestions: (totalQuestions: number) => void
};

export const useTestStore = create<State & Action>((set, get) => ({
    answers: [],
    totalQuestions: 0,

    setAnswer: (questionId, value) => set(state => {
        state.answers[questionId] = value;
        return {...state};
    }),
    setTotalQuestions: (totalQuestions) => set(state => ({...state, totalQuestions: totalQuestions})),

    getAnswers: () => {
        let state = get();
        let answers: TestsNamespace.AnswerType[] = [...state.answers];

        for (let i = 0; i < state.totalQuestions; i++) {
            if (!answers[i]) {
                answers[i] = [];
            }
        }

        return answers;
    }
}));