import { CardEvent, Transaction } from './types'

type CardTransactionMapping = {
  [cardId: string]: Transaction
}

/**
 * Write a function that receives a large batch of card events from multiple cards,
 * returning an object which maps from cardId -> valid transaction. Only cardIds with
 * a valid transaction should appear in the returned object.
 *
 * A valid transaction is a pair of card events, starting with a RESERVATION event
 * and finishing with either a CONFIRMATION or CANCELLATION event.
 *
 * The input is an array of unprocessed card events. Some events might be duplicated
 * or missing. For duplicated events, you may only use one of its occurrences and
 * discard the rest. Missing events invalidate the transaction.
 *
 * @param cardEvents CardEvent[] List of card events
 * @returns CardTransactionMapping Valid transactions grouped by cardId
 */
export const processCardEvents = (cardEvents: CardEvent[]): CardTransactionMapping => {

  // Steps to implement

  // Seperate the cardevents as per cardId as cards

  //  Seperate cards by types and remove duplicates by id in each type cards.

  //  Combmine as array of objects the types of a single person in an array

  // Output the all the cardIds arrays in output object.


  let cardIds: Array<string> =[];

  cardEvents.forEach((e) => cardIds.push(e.cardId));

  let uniquecardIds = new Set([...cardIds]);
  let output:CardTransactionMapping = {}
  for (let key of uniquecardIds) {
    let afterSeperated = SeperateByTypes(cardEvents.filter((e) => { return e.cardId === key }));

    output[key] = finalArray(afterSeperated)
  }

  return output as CardTransactionMapping
}

interface finalCards {
  Reservation: CardEvent[];
  Confirmation: CardEvent[];
  Cancellation : CardEvent[];
}

const SeperateByTypes = (personCards: CardEvent[]): finalCards => {
  let reservation = personCards.filter((e) => e.type === 'RESERVATION');
  let confirmation = personCards.filter((e) => e.type === 'CONFIRMATION');
  let cancellation = personCards.filter((e) => e.type === 'CANCELLATION');
  reservation = removeDuplicates(reservation);
  confirmation = removeDuplicates(confirmation);
  cancellation = removeDuplicates(cancellation);
  return {
    Reservation: reservation,
    Confirmation: confirmation,
    Cancellation :cancellation
  }
}

const removeDuplicates = (TypeArrays: CardEvent[]): CardEvent[] => {
  let obj: {[key : string]: number} = {};
  let array : CardEvent[] = [];
  TypeArrays.forEach((e: CardEvent) => {
    if (obj[e.id] === undefined) {
      obj[e.id] = 1;
      array.push(e);
    }
  });
  return array
}

function finalArray(arr: finalCards): CardEvent[] {
  let validatedArray : CardEvent[] = []
  for (let i = 0; i < arr.Reservation.length; i++){
    if (arr.Confirmation.length > 0) {
      for (let j = 0; j < arr.Confirmation.length; j++) { 
        if (arr.Reservation[i].amount === arr.Confirmation[j].amount) {
          validatedArray.push(arr.Reservation[i]);
          validatedArray.push(arr.Confirmation[j]);
          }
      }
    }
    else if (arr.Cancellation.length > 0) {
      for (let j = 0; j < arr.Cancellation.length; j++) { 
        if (arr.Reservation[i].amount === arr.Cancellation[j].amount) {
          validatedArray.push(arr.Reservation[i]);
          validatedArray.push(arr.Cancellation[j]);
          }
      }
    }
  }
  return validatedArray
}