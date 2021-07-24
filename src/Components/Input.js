import React, { Component, useEffect, ReactDOM } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TableRow, TableCell, TableHead, Table, TableBody, Box } from '@material-ui/core';
import { spacing } from '@material-ui/system';

const { Octokit } = require("@octokit/core");
const octokit = new Octokit({auth: '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'})

export class ShowFiles extends Component{
    render(){
        if(this.props.gist.files !== null){
        
            return(
                <div>
                  
                    {Object.values(this.props.gist.files).map((file)=>
                        <div>
                            {file.filename}
                        </div>
                    )}
                    
    
                </div>
            )
        }else{
            return null;
        }
    }
   
}

export class ShowTags extends Component{
    render(){
        if(this.props.gist.tags[0] !== null){
        
            return(
                <div>
                
                    {this.props.gist.tags.map((tag)=>
                        <div>
                            {tag}
                        </div>
                    )}
                    
    
                </div>
            )
        }else{
            return null;
        }
    }
    
}

export class ShowDescription extends Component{
    render(){
        if(this.props.gist.description !== ""){
        
            return(
                <div>
                    {this.props.gist.description}
                </div>
            )
        }else{
            return null;
        }
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
                <div>
                        {this.state.forks.map((name)=><div align="center" size="small">{name}</div>)}  
                </div>
                
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
            <TableRow>

                <TableCell align="center" size="small">
                 {gist.id}
                </TableCell>

                {/* <TableCell size="small" align="justify">
                    <ShowDescription gist = {gist}/>
                </TableCell> */}

                <TableCell align="center" size="small">
                    <ShowTags gist = {gist} />
                </TableCell>

                <TableCell align="center" size="small">
                    <ShowFiles gist = {gist}/>
                </TableCell>

                <TableCell align="center" size="small">
                    <ShowForks gist = {gist}/>
                </TableCell>    
            </TableRow>
            )
            return(
                <TableContainer component="Paper"  >
                    <Table style={{width: "50%"}} aria-label="pagination table" align="center" >

                        <TableHead>
                            <TableRow>
                                <TableCell align="center" size="small">ID</TableCell>
                                {/* <TableCell align="left" size="small">Description</TableCell> */}
                                <TableCell align="center" size="small">Tags</TableCell>
                                <TableCell align="center" size="small">Files</TableCell>
                                <TableCell align="center" size="small">Forks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gists} 
                        </TableBody>
                        
                    </Table>
                </TableContainer>
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
                <Box sx={{marginTop:50, marginBottom: 50}}>
                <form  onSubmit={this.handleSubmit} align="center" >
                    <div>
                        <input style={{width: "25%", textAlign: 'center'}} size="medium" align="center" id="username"  type="text" placeholder="Username" />
                        <div>
                            <input align="center" type="submit" value="Get Gists" />
                        </div>
                        
                    </div>
                </form>
                </Box>
                
                <Box sx={{marginTop:50, marginBottom: 50}}>
                    <ShowGists  toSend={toSend} data={data} ></ShowGists>
                </Box>
                
            </div>
                
        )
        
        
    }
}