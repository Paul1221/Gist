import React, { Component, useEffect, ReactDOM } from 'react';
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({auth: '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'})

export function ShowFiles(props){
    if(props.gist.files !== null){
        
        return(
            <div>
                Files:
                <ul >
                    {Object.values(props.gist.files).map((file)=>
                        <li>
                            Filename: {file.filename}
                        </li>
                    )}
                </ul>

            </div>
        )
    }else{
        return null;
    }
}

export function ShowTags(props){
    if(props.gist.tags[0] !== null){
        
        return(
            <div>
                Tags:
                <ul>
                    {props.gist.tags.map((tag)=>
                        <li>
                            {tag}
                        </li>
                    )}
                </ul>

            </div>
        )
    }else{
        return null;
    }
}

export function ShowDescription(props){
    if(props.gist.description !== ""){
        
        return(
            <div>
                Description:{props.gist.description}
            </div>
        )
    }else{
        return null;
    }
}

export class ShowForks extends Component{
    constructor(props){
        super(props)
        this.state ={
            forks: [],
            done: false
        }
    }

    componentDidMount(){
        octokit.request('GET /gists/{gist_id}/forks', {
            per_page: 3,
            gist_id: this.props.gist.id
        }).then((res,err)=>{
            if(res){
                for(let i = 0;i<res.data.length;i++){
                    // console.log(res.data[i].owner)
                    this.state.forks.push(res.data[i].owner.login);
                }
                this.setState({done: true});
            }
        })
    }

    render(){
        console.log(this.state.forks)
        if(this.state.done === true && this.state.forks.length !== 0){
            
            return(
                <ul>
                    Forks:{this.state.forks.map((name)=><li>{name}</li>)}
                </ul>
            )
        }else{
            return null;
        }
    }
    
}

export class ShowGists extends Component{
    
    render(){
        

        if(this.props.data === true){
            let tags = [];
        
            this.props.toSend.map((gist)=>{
                tags = []
                Object.values(gist.files).map((file)=>{
                    if(!tags.includes(file.language)){
                        tags.push(file.language);
                    }
                    return null;
                }) 
                gist['tags']= tags; 
                return null;
            })
            const gists = this.props.toSend.map((gist)=>
                <div>
                        Id:{gist.id}
                        <br/>
                            <ShowDescription gist = {gist}/>
                        <br/>
                            <ShowTags gist = {gist} />
                        <br/>
                            <ShowFiles gist = {gist}/>
                        <br/> 
                        <br/>
                            <ShowForks gist = {gist}/>
                        <br/> 
                </div>
            )
            return(
                <ul>{gists}</ul>
              );
        }else{
                return null
            }
            
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