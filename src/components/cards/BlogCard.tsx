
const BlogCard = (props:{imageUrl:string,date:string,title:string,text:string}) => {

    return(
        <div className="w-[300px] p-4 shadow-md rounded-lg">
            <img src={props.imageUrl} alt="" className="block w-full h-[200px]"/>
            <div className="content">
                <span className="pt-4">{props.date}</span>
                <h2 className="sub-title-section pb-2">{props.title}</h2>
                <p className="pb-4">{props.text} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum veniam ratione error accusantium esse ipsum libero facilis quo nihil ab!</p>
            </div>
            <div className="secondary-btn p-2 w-24">Lire Plus</div>
        </div>
    )
}

export default BlogCard;