import React, { Component, useEffect, ReactDOM } from 'react';
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({auth: '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'})


export function ShowGists(props){
    let toSend = []
    toSend = props.toSend;
    if(props.data === true){
    console.log(toSend)

    const ceva = toSend.map((gist)=>
        <div>
                Id:{gist.id}
                <br/>
                Description:{gist.description}
                <br/>
                Files:
                  <ul>
                    {Object.values(gist.files).map((file)=>
                        <li>
                            Filename: {file.filename}   Type: {file.language} 
                        </li>
                    )}
                </ul> 
                <br/> 
        </div>
    )
    //console.log(ceva)
    return(
        <ul>{ceva}</ul>
      );
    }else{
        return null
    }
    
    
}

export class SearchBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: false,
            toSend: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({toSend: []});
        this.setState({data: false})

        this.setState({data: document.getElementById("username").value});
        if(document.getElementById("username").value !== ""){
            octokit.request('GET /users/{username}/gists', {
                username: document.getElementById("username").value
              }).then((res,err)=>{
                  if(res){
                    for(let i = 0;i<res.data.length;i++){
                        this.state.toSend.push({id: res.data[i].id,description: res.data[i].description, forks_url: res.data[i].forks_url,files: res.data[i].files });
                        this.setState({data: true})
                    }
                  }
              })
            
        }
        
    }

    render(){
        const {data, toSend} = this.state;
        
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>
                            Username:
                            <input id="username" type="text" />
                        </label>
                        <input type="submit" value="Submit" />
                        
                    </div>
                </form>
                <ShowGists toSend={toSend} data={data} ></ShowGists>
            </div>
                
        )
        
        
    }
}