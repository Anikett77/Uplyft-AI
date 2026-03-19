
export default async function UserProfile({ params }){
    const resolvedParams = await params
    return(
        <div>
            profile
            <hr />
            <p className="text-2xl bg-green-500 flex flex-col">Profile Page 
                <span className="bg-orange-500">{resolvedParams.id} </span>
                </p>
        </div>

    )
}