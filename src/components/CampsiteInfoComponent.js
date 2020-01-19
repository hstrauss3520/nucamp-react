

import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, 
  Modal, ModalHeader, ModalBody, Button, Label, Col, Row,
  Breadcrumb, BreadcrumbItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import { controls } from 'react-redux-form';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';


const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const isNumber = val => !isNaN(+val);
const validEmail = val => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
class CommentForm extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      rating: '',
      author: '',
      text: '',
      touched: {
          rating: false,
          author: false,
          text: false,
      }
  };

  this.handleInputChange = this.handleInputChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.toggleModal = this.toggleModal.bind(this);
}

handleInputChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

  toggleModal() {
    this.setState({
        isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    console.log('Current state is: ' + JSON.stringify(values));
    alert('Current state is: ' + JSON.stringify(values));

    this.toggleModal();
    this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
  }

  render() {
    return(
      <div >  
        
          
          <Button type="submit" className="fa fa-pencil" outline="true" color="primary" onClick={this.toggleModal}>
                  Submit Comment
          </Button>

          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                            <LocalForm onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <Label htmlFor="rating">Rating</Label>
                                        <Control.select model=".rating" id="rating" name="rating" 
                                            className="form-control">
                                            
                                       
                                              <option>1</option>
                                              <option>2</option> 
                                              <option>3</option>
                                              <option>4</option> 
                                              <option>5</option> 
                                            
                                        </Control.select>
                                    </div>
                                    <div className="form-group">
                                        <Label htmlFor="author">Your Name</Label>
                                        <Control.text model=".author" id="author" name="author" placeholder="Your Name"
                                            className="form-control" 
                                            validators={{
                                              required,
                                              minLength: minLength(2),
                                              maxLength: maxLength(15)
                                          }}> 
                                        
                                              
                                        </Control.text>
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            component="div"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be at least 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                        }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <Label htmlFor="text"> Comment </Label>
                                            <Control.textarea model=".text" rows="12" id="text" name="text"
                                                className="form-control">
                                          
                                            </Control.textarea>
                                        
                                    </div>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                </LocalForm>            
                    </ModalBody>
                </Modal>

      </div>
    );
      
  }
}


function RenderCampsite({campsite}) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg width="100%" top src={campsite.image} alt={campsite.name} />
        <CardBody>
          
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

function RenderComments({comments, addComment, campsiteId}) {  
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>

        {comments.map(comment => {
          return (
            <div key={comment.id}>
              <div> {comment.text} </div>
              <div>
                --{comment.author}{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit"
                }).format(new Date(Date.parse(comment.date)))}
              </div>
              <br></br>
            </div>
          );
        })}

        <CommentForm campsiteId={campsiteId} addComment={addComment} />
      </div>
    
      );
  } else {
    return <div></div>;
  }

}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }



    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments} 
                        addComment={props.addComment}
                        campsiteId= {props.campsite.id}

                    />
                </div>
            </div>
        );
    }
    return <div />;
}

export default CampsiteInfo;
