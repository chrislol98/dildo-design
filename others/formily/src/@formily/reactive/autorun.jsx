import { ReactionStack } from './environment';
export const autorun = (tracker) => {
  const reaction = () => {
    ReactionStack.push(reaction);
    tracker();
    ReactionStack.pop();
  };
  reaction();
};
