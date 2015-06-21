package de.hszg.xml.DataCreator.creator;

import java.util.Random;

public class DataCreator {

	private String mac;
	private double latitude;
	private double longitude;
	private Random random;

	public DataCreator() {
		this.random = new Random();
		this.mac = randomMACAddress();
		this.latitude = randomDegree(90);
		this.longitude = randomDegree(180);
	}
	
	public DataCreator(String mac, double latitude, double longitude) {
		this.random = new Random();
		this.mac = mac;
		this.latitude = latitude;
		this.longitude = longitude;
	}



	public double getLatitude(){
		return this.latitude;
	}
	
	public double getLongitude(){
		return this.longitude;
	}
	
	public String getMac(){
		return this.mac;
	}
	
	public void generateNext(int radius) {
	    // Convert radius from meters to degrees
	    double radiusInDegrees = radius / 111000f;

	    double u = random.nextDouble();
	    double v = random.nextDouble();
	    double w = radiusInDegrees * Math.sqrt(u);
	    double t = 2 * Math.PI * v;
	    double x = w * Math.cos(t);
	    double y = w * Math.sin(t);

	    // Adjust the x-coordinate for the shrinking of the east-west distances
	    double new_x = x / Math.cos(this.latitude);

	    double foundLongitude = new_x + this.longitude;
	    double foundLatitude = y + this.latitude;
	    this.latitude = foundLatitude;
	    this.longitude = foundLongitude;
	}
	
	private double randomDegree(int max){
		return random.nextDouble()*max -max;
	}

	private String randomMACAddress() {
		byte[] macAddr = new byte[6];
		random.nextBytes(macAddr);

		macAddr[0] = (byte) (macAddr[0] & (byte) 254); // zeroing last 2 bytes
														// to make it unicast
														// and locally
														// adminstrated

		StringBuilder sb = new StringBuilder(18);
		for (byte b : macAddr) {

			if (sb.length() > 0)
				sb.append(":");

			sb.append(String.format("%02x", b));
		}

		return sb.toString();
	}

}
