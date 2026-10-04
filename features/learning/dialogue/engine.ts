import type { DialogueNode, DialogueOption, DialogueScript } from "@/types";

/**
 * DIALOGUE ENGINE
 *
 * A conversation is a list of turns. What the character says next is decided
 * by a `DialogueResponder`. The MVP ships `ScriptedResponder`, which follows
 * predefined branches from the content. An AI conversation engine can later
 * implement the same interface (free-text or speech in → character reply out)
 * without touching the UI.
 */

export interface DialogueTurn {
  speaker: "character" | "learner";
  text: string;
}

export interface DialogueState {
  nodeId: string;
  turns: DialogueTurn[];
  /** Learner replies that moved the conversation forward. */
  steps: number;
  mistakes: number;
  ended: boolean;
}

export type DialogueReply =
  | { kind: "advance"; state: DialogueState; characterLine: string }
  | { kind: "hint"; state: DialogueState; hint: string; conceptId?: string };

export interface DialogueResponder {
  /** Reply options offered to the learner at the current point (empty for free input). */
  options(state: DialogueState): DialogueOption[];
  respond(state: DialogueState, choice: DialogueOption): Promise<DialogueReply>;
}

export function createDialogueState(script: DialogueScript): DialogueState {
  const start = script.nodes[script.startNodeId];
  return {
    nodeId: start.id,
    turns: [{ speaker: "character", text: start.line }],
    steps: 0,
    mistakes: 0,
    ended: !!start.end,
  };
}

export function currentNode(script: DialogueScript, state: DialogueState): DialogueNode {
  return script.nodes[state.nodeId];
}

/** Longest number of learner replies from the current node to an ending (for progress dots). */
export function longestPath(script: DialogueScript, fromId: string = script.startNodeId, seen: Set<string> = new Set()): number {
  const node = script.nodes[fromId];
  if (!node || node.end || seen.has(fromId)) return 0;
  const nextSeen = new Set(seen).add(fromId);
  const depths = node.options.filter((o) => o.next).map((o) => longestPath(script, o.next as string, nextSeen));
  return depths.length ? 1 + Math.max(...depths) : 0;
}

export class ScriptedResponder implements DialogueResponder {
  constructor(private readonly script: DialogueScript) {}

  options(state: DialogueState): DialogueOption[] {
    return state.ended ? [] : currentNode(this.script, state).options;
  }

  async respond(state: DialogueState, choice: DialogueOption): Promise<DialogueReply> {
    if (!choice.next) {
      return {
        kind: "hint",
        hint: choice.hint ?? "",
        conceptId: choice.conceptId,
        state: { ...state, mistakes: state.mistakes + 1 },
      };
    }
    const next = this.script.nodes[choice.next];
    return {
      kind: "advance",
      characterLine: next.line,
      state: {
        nodeId: next.id,
        steps: state.steps + 1,
        mistakes: state.mistakes,
        ended: !!next.end,
        turns: [...state.turns, { speaker: "learner", text: choice.text }, { speaker: "character", text: next.line }],
      },
    };
  }
}
