"use client";

import { ChoiceExercise } from "./ChoiceExercise";
import { ConversationExercise } from "./ConversationExercise";
import { RealTaskExercise } from "./RealTaskExercise";
import { StoryExercise } from "./StoryExercise";
import { DialogueExercise } from "./DialogueExercise";
import { MatchingExercise } from "./MatchingExercise";
import { SentenceBuilderExercise } from "./SentenceBuilderExercise";
import { SpeakingExercise } from "./SpeakingExercise";
import type { ExerciseViewProps } from "./types";

/**
 * Maps exercise data to its view. Adding a new exercise type means:
 * a type in /types, a checker in the engine, a view here.
 */
export function ExerciseRenderer(props: ExerciseViewProps) {
  const { exercise, ...rest } = props;
  switch (exercise.type) {
    case "MULTIPLE_CHOICE":
    case "IMAGE_CHOICE":
    case "LISTENING":
    case "FILL_GAP":
      return <ChoiceExercise exercise={exercise} {...rest} />;
    case "MATCHING":
      return <MatchingExercise exercise={exercise} {...rest} />;
    case "SENTENCE_BUILDER":
      return <SentenceBuilderExercise exercise={exercise} {...rest} />;
    case "SPEAKING":
      return <SpeakingExercise exercise={exercise} {...rest} />;
    case "DIALOGUE":
      return <DialogueExercise exercise={exercise} {...rest} />;
    case "STORY":
      return <StoryExercise exercise={exercise} {...rest} />;
    case "CONVERSATION":
      return <ConversationExercise exercise={exercise} {...rest} />;
    case "REAL_TASK":
      return <RealTaskExercise exercise={exercise} {...rest} />;
  }
}
