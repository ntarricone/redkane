import React from 'react';
import "./Filter.css"

interface IGlobalStateProps{

}

type TProps = IGlobalStateProps;

class Filter extends React.PureComponent<TProps>{
  render(){
    return(
<>



<section className="search-sec">
    <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 p-0 " style={{ width: "60rem" }}>
                            <input type="text" className="form-control search-slt" placeholder="Enter Drop City"/>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12 p-0">
                            <select className="form-control search-slt" id="exampleFormControlSelect1">
                                <option>Multimedia Type</option>
                                <option>Article</option>
                                <option>Image</option>
                                <option>Video</option>
                            </select>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 p-0">
                            <select className="form-control search-slt" id="exampleFormControlSelect1">
                                <option>Filter by</option>
                                <option>Popular</option>
                                <option>Recent</option>
                                <option>Free</option>
                                <option>Paid</option>
                            </select>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 p-0">
                            <button type="button" className="btn btn-danger wrn-btn">Search</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</section>

</>

    )
  }
}

export default Filter;
