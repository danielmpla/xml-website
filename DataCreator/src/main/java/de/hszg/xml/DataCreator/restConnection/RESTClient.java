package de.hszg.xml.DataCreator.restConnection;

import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class RESTClient {

	private Invocation.Builder invocationBuilder;
	private String host;

	public RESTClient(String host) {
		this.host = host;
		ClientConfig clientConfig = new ClientConfig();

		Client client = ClientBuilder.newClient(clientConfig);
		WebTarget webTarget = client.target(host);
		WebTarget resourceWebTarget = webTarget.path("db");
		WebTarget helloworldWebTarget = resourceWebTarget.path("apps/positiontrack/xq/rest.xq");
		invocationBuilder = helloworldWebTarget.request(MediaType.TEXT_PLAIN_TYPE);
		invocationBuilder.header("some-header", "true");

	}

	public void sendCoordinates(String mac, double latitude, double longitude) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		String date = sdf.format(new Date());
		String xml = createXML(mac, date, latitude, longitude);
		// TODO sends a new pair of coords for the client
		Response response = invocationBuilder.post(Entity.entity(xml, MediaType.APPLICATION_XML));
		System.out.println(xml);
		System.out.println(response.getStatus());
		System.out.println(response.readEntity(String.class));
		
	}

	public void get() {
		Response response = invocationBuilder.get();
		System.out.println(response.getStatus());
		System.out.println(response.readEntity(String.class));
		// TODO senseless
	}

	private String createXML(String macAdress, String time, double latitude, double longitude) {
		try {
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();

		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("newEntry");
		rootElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		rootElement.setAttribute("xmlns", "http://exist-db.org/xquery/xmldb");
		doc.appendChild(rootElement);

		Element mac = doc.createElement("mac");
		mac.appendChild(doc.createTextNode(macAdress));
		rootElement.appendChild(mac);

		Element entry = doc.createElement("entry");
		
		Element timestamp = doc.createElement("timestamp");
		timestamp.appendChild(doc.createTextNode(time));
		
		Element lon = doc.createElement("longitude");
		lon.appendChild(doc.createTextNode(String.valueOf(longitude)));
		
		Element lat = doc.createElement("latitude");
		lat.appendChild(doc.createTextNode(String.valueOf(latitude)));
		
		entry.appendChild(timestamp);
		entry.appendChild(lon);
		entry.appendChild(lat);
		
		rootElement.appendChild(entry);

		// write the content into xml file
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		DOMSource source = new DOMSource(doc);
		StringWriter writer = new StringWriter();
		
		 StreamResult result = new StreamResult(writer);
		transformer.transform(source, result);
		String xml = writer.getBuffer().toString();
		return xml;
		} catch (ParserConfigurationException | TransformerException e) {
			e.printStackTrace();
			return(null);
		}
	}

}
