package collabrationTool;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;

import javax.servlet.ServletContext;
import javax.servlet.http.Part;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;

@ManagedBean
@SessionScoped
public class HomeBean implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String name;
	private String meetingId;
	private Part uploadedFile;
	private boolean showImages;
	private ArrayList<String> imagesList = new ArrayList<String>();
	private boolean fileupload;


	public String createMeeting(){
		fileupload =true;   
		 return "create";  
	   }

	 public String loadFile() throws IOException{
		 
		 imagesList.clear();
		 fileupload =true;   
		 InputStream is = uploadedFile.getInputStream();  
	        XMLSlideShow ppt = new XMLSlideShow(is);
	        is.close();

	        double zoom = 2; // magnify it by 2
	        AffineTransform at = new AffineTransform();
	        at.setToScale(zoom, zoom);

	        Dimension pgsize = ppt.getPageSize();

	        List<XSLFSlide> slide = ppt.getSlides();
	        for (int i = 0; i < slide.size(); i++) {
	            BufferedImage img = new BufferedImage((int)Math.ceil(pgsize.width*zoom), (int)Math.ceil(pgsize.height*zoom), BufferedImage.TYPE_INT_RGB);
	            Graphics2D graphics = img.createGraphics();
	            graphics.setTransform(at);

	            graphics.setPaint(Color.white);
	            graphics.fill(new Rectangle2D.Float(0, 0, pgsize.width, pgsize.height));
	            slide.get(i).draw(graphics);
	            ServletContext ctx = (ServletContext) FacesContext.getCurrentInstance()
	                    .getExternalContext().getContext();
	            
	            FileOutputStream out = new FileOutputStream(ctx.getRealPath("/")+"resources/images/"+
	            meetingId+"_slide_" + (i + 1) + ".png");
	            imagesList.add("/images/"+meetingId+"_slide_" + (i + 1) + ".png");
	           
	            javax.imageio.ImageIO.write(img, "png", out);
	            out.close();
	        }
		
		 return "create";
	 }
	
	 public String openMeeting(){
		 fileupload =false;
		 return "create";
	 }

	 
	 public boolean isFileupload() {
		return fileupload;
	}

	public void setFileupload(boolean fileupload) {
		this.fileupload = fileupload;
	}

	public boolean isShowImages() {
		return showImages;
	}

	public void setShowImages(boolean showImages) {
		this.showImages = showImages;
	}
	public Part getUploadedFile() {
		return uploadedFile;
	}

	public void setUploadedFile(Part uploadedFile) {
		this.uploadedFile = uploadedFile;
	}

	public String getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public ArrayList<String> getImagesList() {
		return imagesList;
	}

	public void setImagesList(ArrayList<String> imagesList) {
		this.imagesList = imagesList;
	}

	
	
}