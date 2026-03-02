import "./index.css";

const Footer = () => {
    return (<div class="footer w-100 position-relative pb-3 p-4">
        <div class="filter w-100 h-100"></div>
        <h4 class="mb-4 pointer">CHERRY PRODUCTION</h4>
        <div class="row mb-3">
            <div class="col-5">
                <div class="row">
                    <div class="col-4">
                        <div class="nav">Home</div>
                    </div>
                    <div class="col-4">
                        <div class="nav">Search</div>
                    </div>
                    <div class="col-4">
                        <div class="nav">Feedback</div>
                    </div>
                </div>
            </div>
        </div>
        <span>© 2026 CherryProduction</span>
    </div>)
}

export default Footer;