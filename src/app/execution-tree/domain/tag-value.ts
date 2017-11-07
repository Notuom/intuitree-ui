import {Tag} from '../../shared/domain/tag';

export class TagValue {

  tag: Tag;
  value: string;

  constructor(tag: Tag, value: string) {
    this.tag = tag;
    this.value = value;
  }

}
