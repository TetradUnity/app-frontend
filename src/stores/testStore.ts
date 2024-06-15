import { TestsNamespace } from "@/types/api.types";
import { create } from "zustand";

type State = {
    answers: (TestsNamespace.AnswerType | undefined)[]
};

type Action = {
    setAnswer: (questionId: number, value: TestsNamespace.AnswerType) => void,
    totalQuestions: number,

    getAnswers: () => TestsNamespace.AnswerType[],
    setAnswers: (answers: TestsNamespace.AnswerType[]) => void,
    setTotalQuestions: (totalQuestions: number) => void
};

export const useTestStore = create<State & Action>((set, get) => ({
    answers: [],
    totalQuestions: 0,

    setAnswer: (questionId, value) => set(state => {
        state.answers[questionId] = value;
        return {...state};
    }),
    setAnswers: (answers) => set(state => {
        state.answers = [];
        let answ = null;

        for (let i = 0; i < answers.length; i++) {
            answ = answers[i];
            if (answ.length == 1) {
                answ = answ[0];
            }
            // @ts-ignore
            state.answers[i] = answ;
        }

        return {...state};
    }),
    setTotalQuestions: (totalQuestions) => set(state => ({...state, totalQuestions: totalQuestions})),

    getAnswers: () => {
        let state = get();
        // @ts-ignore
        let answers: TestsNamespace.AnswerType[] = [...state.answers];

        for (let i = 0; i < state.totalQuestions; i++) {
            if (!answers[i]) {
                answers[i] = [];
            }
        }

        return answers;
    }
}));