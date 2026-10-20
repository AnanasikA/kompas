import { describe, expect, it } from "vitest";
import { helloWorld } from "@/data/curriculum/child/pre-a1/hello-world";
import { judgeTurn, normalise, says } from "@/features/learning/engine/conversation";
import { isPlayable, type ConversationExercise } from "@/types";

const talk = (lessonId: string) =>
  helloWorld.lessons.filter(isPlayable).find((l) => l.id.endsWith(lessonId))!.exercises.find((e): e is ConversationExercise => e.type === "CONVERSATION")!;

describe("normalise and says", () => {
  it("ignores case, punctuation and contractions", () => {
    expect(normalise("I'm Zosia!")).toBe("i am zosia");
    expect(normalise("What’s your name?")).toBe("what is your name");
    expect(says("Good morning, Leo!", "good morning")).toBe(true);
    expect(says("goodmorning", "good morning")).toBe(true);
    expect(says("Thanks!", "thank you")).toBe(true);
  });
  it("matches whole words only", () => {
    expect(says("hiking", "hi")).toBe(false);
    expect(says("no", "no thank you")).toBe(false);
  });
});

describe("Hello World conversations understand children", () => {
  const leo = talk("l01-hello").turns;
  const bell = talk("l02-name").turns;

  it("greetings: the right one passes, a wrong time of day gets a friendly correction", () => {
    expect(judgeTurn(leo.morning, ["Good morning Leo"]).kind).toBe("answer");
    expect(judgeTurn(leo.morning, ["Hi!"]).kind).toBe("answer");
    expect(judgeTurn(leo.morning, ["Good night"]).kind).toBe("miss");
    expect(judgeTurn(leo.evening, ["good evening Ms Bell"]).kind).toBe("answer");
    expect(judgeTurn(leo.evening, ["hello"]).kind).toBe("miss");
  });

  it("asks for the magic word", () => {
    expect(judgeTurn(leo.apple, ["yes"]).kind).toBe("miss");
    expect(judgeTurn(leo.apple, ["Yes, please!"]).kind).toBe("answer");
    expect(judgeTurn(leo.apple, ["no thanks"]).kind).toBe("answer");
    expect(judgeTurn(leo.here, ["thanks Leo"]).kind).toBe("answer");
  });

  it("a name alone is fine, a full sentence is better, the question back is a friendly miss", () => {
    const full = judgeTurn(bell.name, ["I'm Zosia"]);
    expect(full.kind === "answer" && !full.answer.says.includes("*")).toBe(true);
    const alone = judgeTurn(bell.name, ["Zosia"]);
    expect(alone.kind === "answer" && alone.answer.says.includes("*")).toBe(true);
    expect(judgeTurn(bell.name, ["What's your name?"]).kind).toBe("miss");
    expect(judgeTurn(bell.ask, ["what's your name"]).kind).toBe("answer");
  });

  it("uses every hypothesis from speech recognition", () => {
    expect(judgeTurn(leo.morning, ["good mourning", "good morning"]).kind).toBe("answer");
  });

  it("nothing heard is unclear, not a mistake about English", () => {
    expect(judgeTurn(leo.morning, [""]).kind).toBe("unclear");
    expect(judgeTurn(leo.morning, ["banana"]).kind).toBe("unclear");
  });
});
