import * as React from 'react';
import {Component} from 'react';

import './Console.css';

export class Console extends Component<{ id: string, content?: string }> {

  private readonly ref = React.createRef<HTMLTextAreaElement>();

  public componentDidUpdate() {
   if (this.ref.current) {
     this.ref.current.scrollTop = this.ref.current.scrollHeight;
     this.ref.current.style.height = this.ref.current.scrollHeight <= 130 ? '130px' : '300px';
   }
  }

  public render() {
    const onChange = () => {
    };
    const consoleContent = this.props.content || '';
    return (
      <div className="console">
        Console
        <textarea ref={this.ref} id={this.props.id} name="console" onChange={onChange}
                  className="console" rows={5} disabled={true} value={consoleContent}/>
      </div>
    );
  }
}