import { TestsNamespace } from "@/types/api.types";
import { create } from "zustand";

type State = {
    answers: TestsNamespace.AnswerType[]
};

type Action = {
    setAnswer: (questionId: number, value: TestsNamespace.AnswerType) => void
};

export const useTestStore = create<State & Action>(set => ({
    answers: [],

    setAnswer: (questionId, value) => set(state => {
        state.answers[questionId] = value;
        return {...state};
    })
}));